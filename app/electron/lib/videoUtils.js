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

  getThumbnails(videoUrl) {
    return new Promise((resolve, reject) => {
      this.youtubedl.getThumbs(
        videoUrl,
        { cwd: this.thumbnailDir },
        (err, files) => {
          if (err) reject(err);

          const filePaths = files.map((file) => {
            return `file://${path.join(this.thumbnailDir, file)}`;
          });
          resolve(filePaths);
        }
      );
    });
  }

  download(videoUrl, format, onProgress = () => {}, onDone = () => {}) {
    const args = ["--format", format];
    const video = this.youtubedl(videoUrl, args);

    let size = 0;
    video.on("info", (info) => {
      size = info.size;
      const outputFile = path.join(this.downloadDir, info._filename); // eslint-disable-line no-underscore-dangle
      video.pipe(this.fs.createWriteStream(outputFile));
    });

    let pos = 0;
    video.on("data", function data(chunk) {
      pos += chunk.length;

      // `size` should not be 0 here.
      if (size) {
        const state = {
          progress: pos / size,
        };

        onProgress(state);
      }
    });

    video.on("end", function end() {
      onDone();
    });
  }
}

const Requests = {
  getFormats: "Request.getFormats",
  getThumbnails: "Request.getThumbnails",
  download: "Request.download",
};

const Responses = {
  getFormats: "Response.getFormats",
  getThumbnails: "Response.getThumbnails",
  download: {
    progress: "Response.download.progress",
    done: "Response.download.done",
  },
};

function preloadBindings(ipcRenderer) {
  return {
    getFormats: (videoUrl, next) => {
      ipcRenderer.send(Requests.getFormats, videoUrl);

      ipcRenderer.on(Responses.getFormats, (event, formats) => {
        next(formats);
      });
    },
    getThumbnails: (videoUrl, next) => {
      ipcRenderer.send(Requests.getThumbnails, videoUrl);

      ipcRenderer.on(Responses.getThumbnails, (event, thumbnails) =>
        next(thumbnails)
      );
    },
    download: (videoUrl, format, onProgress, onDone) => {
      ipcRenderer.send(Requests.download, videoUrl, format);

      ipcRenderer.on(Responses.download.progress, (event, progress) =>
        onProgress(progress)
      );
      // eslint-disable-next-line no-unused-vars
      ipcRenderer.on(Responses.download.done, (event) => {
        onDone();
      });
    },
  };
}

function mainBindings(ipcMain, app, fs, youtubedl) {
  const videoUtils = new VideoUtils(app, fs, youtubedl);

  // getFormats bindings
  ipcMain.on(Requests.getFormats, (event, videoUrl) => {
    videoUtils.getFormats(videoUrl).then((formats) => {
      event.reply(Responses.getFormats, formats);
    });
  });

  // getThumbnails bindings
  ipcMain.on(Requests.getThumbnails, (event, videoUrl) => {
    videoUtils.getThumbnails(videoUrl).then((thumbnails) => {
      event.reply(Responses.getThumbnails, thumbnails);
    });
  });

  // download bindings
  const onProgress = (event) => {
    return (progress) => event.reply(Responses.download.progress, progress);
  };
  const onDone = (event) => {
    return () => event.reply(Responses.download.done);
  };
  ipcMain.on(Requests.download, (event, videoUrl, format) => {
    videoUtils.download(videoUrl, format, onProgress(event), onDone(event));
  });
}

exports.preloadBindings = preloadBindings;
exports.mainBindings = mainBindings;
