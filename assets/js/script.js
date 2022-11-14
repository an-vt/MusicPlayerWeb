const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8_PLAYER";
const cd = $(".cd ");
const cdWidth = cd.offsetWidth;
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const btnPlay = $(".btn-toggle-play");
const btnNext = $(".btn-next");
const btnPrev = $(".btn-prev");
const player = $(".player");
const progress = $("#progress");
const btnRandom = $(".btn-random");
const btnRepeat = $(".btn-repeat");
const playlist = $(".playlist");

/*
Chú ý khi bắt sự kiện khi bấm vào song
không lắng nghe vào class song vì bài hát còn được render lại
nếu dùng thì khi DOM render lại sẽ không lắng nghe được
*/

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRepeat: false,
  isRandom: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Chúng Ta Của Hiện Tại",
      singer: "Sơn Tùng M-TP",
      path: "./assets/music/ChungTaCuaHienTai.mp3",
      image:
        "https://upload.wikimedia.org/wikipedia/vi/d/dc/Ch%C3%BAng_ta_c%E1%BB%A7a_hi%E1%BB%87n_t%E1%BA%A1i.jpg",
    },
    {
      name: "Muộn Rồi Mà Sao Còn",
      singer: "Sơn Tùng M-TP",
      path: "./assets/music/MuonRoiMaSaoCon.mp3",
      image: "https://data.chiasenhac.com/data/cover/140/139611.jpg",
    },
    {
      name: "Dẫu Có Lỗi Lầm (Cover) - Jackie Njine • Live at Acoustic Bar",
      singer: "Jackie Njine • Live at Acoustic Bar",
      path: "./assets/music/Dẫu Có Lỗi Lầm (Cover) - Jackie Njine • Live at Acoustic Bar (128 kbps).mp3",
      image: "",
    },
    {
      name: "Muộn Rồi Mà Sao Còn - Sơn Tùng MTP Live Lazada 1111",
      singer: "Sơn Tùng MTP Live Lazada",
      path: "./assets/music/Muộn Rồi Mà Sao Còn - Sơn Tùng MTP Live Lazada 1111.mp3",
      image: "",
    },
    {
      name: "Chay Khoi The Gioi Nay (Cukak Remix) - Da LAB, Phuong Ly",
      singer: "(Cukak Remix) - Da LAB, Phuong Ly",
      path: "./assets/music/X2Download.app - Chạy Khỏi Thế Giới Này - Da LAB ft. Phương Ly「Cukak Remix」_ Audio Lyric Video (320 kbps).mp3",
      image: "",
    },
    {
      name: "Lan Hen Ho Dau Tien",
      singer: "JUONGB x HELIØS",
      path: "./assets/music/Lan Hen Ho Dau Tien (JUONGB x HELIØS).mp3",
      image: "",
    },
    {
      name: "Lâu Đài Tình Ái (Disco Version)",
      singer: "JSol X Ducpham",
      path: "./assets/music/Lâu Đài Tình Ái (Disco Version) - JSol X Ducpham (320kp).mp3",
      image: "",
    },
    {
      name: "Co-Dau-Ai-Ngo-Remix-Cam-Cukak-Remix",
      singer: "Cukak Remix",
      path: "./assets/music/Co-Dau-Ai-Ngo-Remix-Cam-Cukak-Remix.mp3",
      image: "",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index = ${index}>
        <div class="thumb" style="background-image: url('${song.image}')">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
    `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  // lắng nghe các sự kiện
  handleEvents: function () {
    // thay đổi this trong function này thành app ở ngoài
    const _this = this;

    // xử lí cd quay và dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, //10 seconds
      iterations: Infinity,
    });

    // pause cd khi chưa play nhạc
    cdThumbAnimate.pause();

    // xử lí phóng to hay thu nhỏ cd
    document.onscroll = function () {
      // window đại diện cho biến cửa sổ trình duyệt của chúng ta
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      var newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth < 0 ? 0 : newCdWidth + "px";
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // xử lí khi click play nhạc
    btnPlay.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // khi bài hát được play
    audio.onplay = function () {
      cdThumbAnimate.play();
      _this.isPlaying = true;
      player.classList.add("playing");
    };

    // khi bài hát bị pause
    audio.onpause = function () {
      cdThumbAnimate.pause();
      player.classList.remove("playing");
      _this.isPlaying = false;
    };

    // khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // xử lí khi tua
    progress.onchange = function (events) {
      const timeUpdate = (events.target.value * audio.duration) / 100;
      audio.currentTime = timeUpdate;
    };

    // xử lí khi next nhạc
    btnNext.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // xử lí khi tải bài nhạc trước
    btnPrev.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Random bài hát
    btnRandom.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      btnRandom.classList.toggle("active", _this.isRandom);
    };

    // next song khi bài hát kết thúc
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        btnNext.click();
      }
    };

    // Lắng nghe click khi vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        // xử lí khi click vào song
        if (songNode) {
          // vì cái đoạn get index ra nó là chuỗi không phải số ta phải convert sang số
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // xử lí khi click vào song option
      }
    };

    // khi repeat lại bài hát
    btnRepeat.onclick = function () {
      console.log("repeat");
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      btnRepeat.classList.toggle("active", _this.isRepeat);
    };
  },
  loadCurrentSong: function () {
    heading.innerText = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  },
  start: function () {
    // Gán cấu hình config vào ứng dụng
    this.loadConfig();

    // định nghĩa các thuốc tính cho object
    this.defineProperties();

    // lắng nghe / xử lí các sự kiện (DOM events)
    this.handleEvents();

    // tải thông tin bài hát đầu tiên vào UI khi run
    this.loadCurrentSong();

    // render lại playlist
    this.render();

    // hiển thị trạng thái ban đầu của button repeat & random
    btnRandom.classList.toggle("active", this.isRandom);
    btnRepeat.classList.toggle("active", this.isRepeat);
  },
};

app.start();
