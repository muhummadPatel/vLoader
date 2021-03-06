const path = require("path");

class VideoUtils {
  constructor(app, fs, youtubedl) {
    this.thumbnailDir = app.getPath("temp");
    this.downloadDir = app.getPath("downloads");

    this.fs = fs;
    this.youtubedl = youtubedl;
  }

  getFormats(videoUrl) {
    function mapInfo(item) {
      const acodec = item.acodec || "none";
      let resolution =
        item.resolution ||
        (item.width
          ? `${item.width}x${item.height}`
          : `(audio only) ${acodec}`);

      if (acodec === "none") {
        resolution = `(video only) ${resolution}`;
      }

      return {
        id: item.format_id,
        filetype: item.ext,
        resolution,
      };
    }

    return new Promise((resolve, reject) => {
      this.youtubedl.getInfo(videoUrl, (err, info) => {
        if (err) reject(err);

        // reverse to get the list of formats from best to worst
        // https://github.com/ytdl-org/youtube-dl/blob/7f41a598b3fba1bcab2817de64a08941200aa3c8/youtube_dl/extractor/common.py#L101-L102
        const formats = info.formats.reverse().map(mapInfo);
        resolve(formats);
      });
    });
  }

  getThumbnail(videoUrl) {
    return new Promise((resolve, reject) => {
      this.youtubedl.getThumbs(
        videoUrl,
        { cwd: this.thumbnailDir },
        (err, files) => {
          if (err || !files || files.length === 0) {
            reject(Error(`Unable to load Thumbnails\n${err}`));
            return;
          }

          const thumbnails = files.map((file) => {
            return `${path.join(this.thumbnailDir, file)}`;
          })[0];

          resolve(thumbnails);
        }
      );
    });
  }

  download(
    videoUrl,
    format,
    onStart = () => {},
    onProgress = () => {},
    onDone = () => {}
  ) {
    const args = ["--format", format];
    const video = this.youtubedl(videoUrl, args);

    let size = 0;
    video.on("info", (info) => {
      const details = {
        size: info.size,
        title: info.fulltitle,
        filename: info._filename, // eslint-disable-line no-underscore-dangle
      };

      size = details.size;
      const outputFile = path.join(this.downloadDir, details.filename);
      video.pipe(this.fs.createWriteStream(outputFile));

      onStart(videoUrl, details);
    });

    let pos = 0;
    video.on("data", function data(chunk) {
      pos += chunk.length;

      // `size` should not be 0 here.
      if (size) {
        const state = {
          progress: ((pos / size) * 100).toFixed(2),
        };

        onProgress(videoUrl, state);
      }
    });

    video.on("end", function end() {
      onDone(videoUrl);
    });
  }
}

const Requests = {
  getFormats: "Request.getFormats",
  getThumbnail: "Request.getThumbnail",
  download: "Request.download",
};

// These need to be functions of the videoURL, because when sending back responses
// to the renderer process, we need to know which videoUrl's callback needs to be
// invoked.
const Responses = {
  getFormats: (videoUrl) => `Response.getFormats${videoUrl}`,
  getThumbnail: (videoUrl) => `Response.getThumbnail${videoUrl}`,
  download: {
    start: (videoUrl) => `Response.download.start${videoUrl}`,
    progress: (videoUrl) => `Response.download.progress${videoUrl}`,
    done: (videoUrl) => `Response.download.done${videoUrl}`,
  },
};

function preloadBindings(ipcRenderer) {
  return {
    getFormats: (videoUrl, next) => {
      ipcRenderer.send(Requests.getFormats, videoUrl);

      ipcRenderer.on(Responses.getFormats(videoUrl), (event, formats) => {
        next(formats);
      });
    },
    getThumbnail: (videoUrl, next) => {
      ipcRenderer.send(Requests.getThumbnail, videoUrl);

      ipcRenderer.on(Responses.getThumbnail(videoUrl), (event, thumbnails) =>
        next(thumbnails)
      );
    },
    download: (videoUrl, format, onStart, onProgress, onDone) => {
      ipcRenderer.send(Requests.download, videoUrl, format);

      ipcRenderer.on(Responses.download.start(videoUrl), (event, details) =>
        onStart(details)
      );
      ipcRenderer.on(Responses.download.progress(videoUrl), (event, progress) =>
        onProgress(progress)
      );
      // eslint-disable-next-line no-unused-vars
      ipcRenderer.on(Responses.download.done(videoUrl), (event) => {
        onDone();
      });
    },
  };
}

function mainBindings(ipcMain, dialog, app, fs, image2base64, youtubedl) {
  const videoUtils = new VideoUtils(app, fs, youtubedl);

  // getFormats bindings
  ipcMain.on(Requests.getFormats, (event, videoUrl) => {
    videoUtils
      .getFormats(videoUrl)
      .then((formats) => {
        event.reply(Responses.getFormats(videoUrl), formats);
      })
      .catch((err) => console.log(err));
  });

  // getThumbnails bindings
  ipcMain.on(Requests.getThumbnail, (event, videoUrl) => {
    videoUtils
      .getThumbnail(videoUrl)
      .then((thumbnail) => {
        image2base64(thumbnail).then((base64String) => {
          const imgStr = `data:image/png;base64, ${base64String}`;
          event.reply(Responses.getThumbnail(videoUrl), imgStr);
        });
      })
      .catch((err) =>
        dialog.showErrorBox("Oops! Something went wrong!", `${err}`)
      );
  });

  // download bindings generators for a given event
  const onStartFor = (event) => {
    return (videoUrl, details) =>
      event.reply(Responses.download.start(videoUrl), details);
  };
  const onProgressFor = (event) => {
    return (videoUrl, progress) =>
      event.reply(Responses.download.progress(videoUrl), progress);
  };
  const onDoneFor = (event) => {
    return (videoUrl) => event.reply(Responses.download.done(videoUrl));
  };
  ipcMain.on(Requests.download, (event, videoUrl, format) => {
    try {
      videoUtils.download(
        videoUrl,
        format,
        onStartFor(event),
        onProgressFor(event),
        onDoneFor(event)
      );
    } catch (err) {
      dialog.showErrorBox("Oops! Something went wrong!", `${err}`);
    }
  });
}

exports.preloadBindings = preloadBindings;
exports.mainBindings = mainBindings;
