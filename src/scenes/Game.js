import Phaser from 'phaser';
// importiamo la classe Hero
import Hero from '../entities/Hero';

class Game extends Phaser.Scene {

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {}

  preload() {

    // generiamo lo sprite sheet per il nostro personaggio
    this.load.spritesheet('hero-idle-sheet', 'assets/hero/idle.png', {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet('hero-run-sheet', 'assets/hero/run.png', {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet('hero-pivot-sheet', 'assets/hero/pivot.png', {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet('hero-jump-sheet', 'assets/hero/jump.png', {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet('hero-flip-sheet', 'assets/hero/spinjump.png', {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet('hero-fall-sheet', 'assets/hero/fall.png', {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet('moon-sheet222', 'assets/hero/moon.png', {
      frameWidth: 100,
      frameHeight: 100,
    });


  
  }

  create(data) {

    // generare un cursor ci permette di poter controllare tutti i possibili click 
    this.cursor = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: 'hero-idle',
      frames: this.anims.generateFrameNumbers('hero-idle-sheet'),
    });

    this.anims.create({
      key: 'hero-running',
      frames: this.anims.generateFrameNumbers('hero-run-sheet'),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'hero-pivoting',
      frames: this.anims.generateFrameNumbers('hero-pivot-sheet'),
    });

    this.anims.create({
      key: 'hero-jumping',
      frames: this.anims.generateFrameNumbers('hero-jump-sheet'),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'hero-flipping',
      frames: this.anims.generateFrameNumbers('hero-flip-sheet'),
      frameRate: 30,
      repeat: 0,
    });

    this.anims.create({
      key: 'hero-fallings',
      frames: this.anims.generateFrameNumbers('hero-fall-sheet'),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'moon-anim',
      frames: this.anims.generateFrameNumbers('moon-sheet222'),
      frameRate: 10,
      repeat: -1,
    });

    this.moon = this.add.sprite(100, 60, 'moon-sheet222');
    this.anims.play('moon-anim', this.moon);

    this.hero = new Hero(this, 215,160);
    

    const piattaforma = this.add.rectangle(220,240,260,10,0x4BCB7C); // creiamo un rettangolo
    this.physics.add.existing(piattaforma,true); // aggiungiamo la fisica al nostro rettangolo


    this.physics.add.collider(this.hero,piattaforma); // aggiungiamo la collisione tra il nostro rettangolo e il nostro personaggio

    

  }

  update(time, delta) {

  }
}

export default Game;