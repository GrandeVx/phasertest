import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#33A5E7',
  scale: {
    width: 500,
    height: 320,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  // definiamo il tipo di render
  render : {
    pixelArt: true, // ottimizzazione per pixel art
  },




  // con questa impostazione definiamo il tipo di fisica che usiamo
  physics: {
    default: 'arcade',
    arcade: {
      // impostando una gravita verticale il nostro player cadrà a 750px al secondo
      gravity: { y: 750 },
      debug: true, // abilitando questo parametro abbiamo una visualizzazione [ elementi,velocity,moviento ]
      debugShowBody: true,
      debugShowVelocity: true,
      debugShowStaticBody: true,
    },
  },

};
