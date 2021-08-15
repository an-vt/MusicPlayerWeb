const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'
const cd = $('.cd ');
const cdWidth = cd.offsetWidth;
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const btnPlay = $('.btn-toggle-play')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const player = $('.player')
const progress = $('#progress')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
const playlist = $('.playlist')

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
        "https://upload.wikimedia.org/wikipedia/vi/d/dc/Ch%C3%BAng_ta_c%E1%BB%A7a_hi%E1%BB%87n_t%E1%BA%A1i.jpg"
    },
    {
      name: "Muộn Rồi Mà Sao Còn",
      singer: "Sơn Tùng M-TP",
      path: "./assets/music/MuonRoiMaSaoCon.mp3",
      image:
        "https://data.chiasenhac.com/data/cover/140/139611.jpg"
    },
    {
      name: "Chạy Ngay Đi (Sky Tour 2019)",
      singer: "Sơn Tùng M-TP",
      path: './assets/music/ChayNgayDiSkyTour.mp3',
      image:
        "https://data.chiasenhac.com/data/cover/123/122398.jpg"
    },
    {
      name: "Mashup Ngôi Nhà Hoa Hồng, Mỗi Người Một Nơi",
      singer: "Vicky Nhung & Tố Ny",
      path: "./assets/music/mashup.mp3",
      image:
        "data:image/jpeg;base64,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"
    },
    {
      name: "Leave The Door Open",
      singer: "Bruno Mars & Anderson Paak & Silk Sonic",
      path: "./assets/music/song5.mp3",
      image:
        "data:image/jpeg;base64,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"
    },
    {
      name: "Yêu thương ngày đó",
      singer: "Soobin Hoàng Sơn",
      path: "./assets/music/Yeu Thuong Ngay Do - Soobin Hoang Son.mp3",
      image:
        "https://data.chiasenhac.com/data/cover/87/86198.jpg"
    },
  ],
  setConfig: function(key ,value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY ,JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song ,index) => {
      return `
      <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
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
    `
    })
    playlist.innerHTML = htmls.join('')
  },
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      }
    })
  },
  // lắng nghe các sự kiện
  handleEvents: function () {
    // thay đổi this trong function này thành app ở ngoài
    const _this = this

    // xử lí cd quay và dừng
    const cdThumbAnimate = cdThumb.animate([
      { transform: 'rotate(360deg)'}
    ] ,{
      duration: 10000 ,//10 seconds
      iterations: Infinity
    })

    // pause cd khi chưa play nhạc
    cdThumbAnimate.pause()

    // xử lí phóng to hay thu nhỏ cd
    document.onscroll = function () {
      // window đại diện cho biến cửa sổ trình duyệt của chúng ta
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      var newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth < 0 ? 0 : newCdWidth + 'px';
      cd.style.opacity = (newCdWidth / cdWidth)
    }

    // xử lí khi click play nhạc
    btnPlay.onclick = function() {
      if(_this.isPlaying) {
        audio.pause()
      }else{
        audio.play()
      }
    }

    // khi bài hát được play
    audio.onplay = function() {
      cdThumbAnimate.play()
      _this.isPlaying = true;
        player.classList.add('playing')
    }

    // khi bài hát bị pause
    audio.onpause = function() {
      cdThumbAnimate.pause()
      player.classList.remove('playing')
      _this.isPlaying = false; 
    }

    // khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function() {
      if(audio.duration) {
        const progressPercent = Math.floor((audio.currentTime / audio.duration)* 100)
        progress.value = progressPercent
      }
    }

    // xử lí khi tua
    progress.onchange = function(events) {
      const timeUpdate = ((events.target.value * audio.duration) / 100)
      audio.currentTime = timeUpdate
    }

    // xử lí khi next nhạc 
    btnNext.onclick = function() {
      if(_this.isRandom){
        _this.playRandomSong()
      }else {
        _this.nextSong();
      }
      audio.play()
      _this.render()
      _this.scrollToActiveSong()
    }

    // xử lí khi tải bài nhạc trước
    btnPrev.onclick = function() {
      if(_this.isRandom){
        _this.playRandomSong()
      }else {
        _this.prevSong();
      }
      audio.play()
      _this.render()
      _this.scrollToActiveSong()
    }

    // Random bài hát
    btnRandom.onclick = function() {
      _this.isRandom = !_this.isRandom
      _this.setConfig('isRandom' ,_this.isRandom)
      btnRandom.classList.toggle('active' ,_this.isRandom)
    } 

    // next song khi bài hát kết thúc
    audio.onended = function() {
      if(_this.isRepeat) {
        audio.play()
      }else {
        btnNext.click()
      }
    }

    // Lắng nghe click khi vào playlist
    playlist.onclick = function(e) {
      const songNode = e.target.closest('.song:not(.active)');
      if(songNode || e.target.closest('.option')){
        
        // xử lí khi click vào song
        if(songNode) {
          // vì cái đoạn get index ra nó là chuỗi không phải số ta phải convert sang số
          _this.currentIndex = Number(songNode.dataset.index)
          _this.loadCurrentSong()
          _this.render()
          audio.play()
        }
        

        // xử lí khi click vào song option
      }
    }

    // khi repeat lại bài hát
    btnRepeat.onclick = function() {
      console.log("repeat")
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat' ,_this.isRepeat)
      btnRepeat.classList.toggle('active' ,_this.isRepeat)
    }
  },
  loadCurrentSong: function () {
    heading.innerText = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
    audio.src = this.currentSong.path
  },
  loadConfig: function() {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function() {
    this.currentIndex++;
    if(this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    };
    this.loadCurrentSong()
  },
  prevSong: function() {
    this.currentIndex--;
    if(this.currentIndex < 0) {
      this.currentIndex = (this.songs.length - 1);
    };
    this.loadCurrentSong()
  },
  playRandomSong: function() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    }while(newIndex === this.currentIndex)
    this.currentIndex = newIndex;
    this.loadCurrentSong()
  },
  scrollToActiveSong: function() {
    setTimeout( () => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    } ,300)
  },
  start: function () {
    // Gán cấu hình config vào ứng dụng
    this.loadConfig()

    // định nghĩa các thuốc tính cho object
    this.defineProperties()

    // lắng nghe / xử lí các sự kiện (DOM events)
    this.handleEvents()

    // tải thông tin bài hát đầu tiên vào UI khi run
    this.loadCurrentSong()

    // render lại playlist
    this.render()

    // hiển thị trạng thái ban đầu của button repeat & random 
    btnRandom.classList.toggle('active' ,this.isRandom)
    btnRepeat.classList.toggle('active' ,this.isRepeat)
  }
}

app.start()