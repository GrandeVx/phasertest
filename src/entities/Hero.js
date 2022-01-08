import Phaser from 'phaser';
import StateMachine from 'javascript-state-machine';

// Classe dedicata al nostro personaggio, dove includeremo tutte le funzioni che lo compongono e le proprietà che lo compongono
class Hero extends Phaser.GameObjects.Sprite {

    constructor(scene,x,y) {

        // prendiamo le informazioni dalla classse base di base Sprite
        super(scene, x, y, 'hero-run-sheet', 0);

        scene.add.existing(this); // aggiungiamo il nostro sprite alla scena
        scene.physics.add.existing(this); // aggiungiamo la fisica al nostro sprite
    

        // con la seguente impostazioni definiamo il punto più basso (y) come pavimento insuperabile
        this.body.setCollideWorldBounds(true);

        // definiamo la dimensione del rettangolo [ utile per la gestione delle collisioni ] 
        this.body.setSize(12,40);
        // la definizione dell'offset permette di inlcudere lo spite perfettamente (va analizzata l'immagine)
        this.body.setOffset(12,23);

        this.body.setMaxVelocity(250,400); // definiamo la velocità massima del nostro personaggio
        
        this.body.setDragX(750); // la fisica di rallentamento del nostro personaggio

        // teniamo traccia dei tasti cliccati in scena principale importando il cursore dalla scena madre
        this.keys = scene.cursor;
        this.input = {};

        this.setupAnimation();
        this.setupMovement(this);

    }

    setupAnimation() {

        this.animState = new StateMachine({
            init: 'idle',
            transitions: [
              { name: 'idle', from: ['falling', 'running', 'pivoting'], to: 'idle' },
              { name: 'run', from: ['falling', 'idle', 'pivoting'], to: 'running' },
              { name: 'pivot', from: ['falling', 'running'], to: 'pivoting' },
              { name: 'jump', from: ['idle', 'running', 'pivoting'], to: 'jumping' },
              { name: 'flip', from: ['jumping', 'falling'], to: 'flipping' },
              { name: 'fall', from: '*', to: 'falling' },
            ],
            methods: {
              onEnterState: (lifecycle) => {
                this.anims.play('hero-' + lifecycle.to);
                //console.log(lifecycle);
              },
            },
          });


        this.animPredicates = {
            idle: () => {
              return this.body.onFloor() && this.body.velocity.x === 0;
            },
            run: () => {
              return this.body.onFloor() && Math.sign(this.body.velocity.x) === (this.flipX ? -1 : 1);
            },
            pivot: () => {
              return this.body.onFloor() && Math.sign(this.body.velocity.x) === (this.flipX ? 1 : -1);
            },
            jump: () => {
              return this.body.velocity.y < 0;
            },
            flip: () => {
              return this.body.velocity.y < 0 && this.moveState.is('flipping');
            },
            fall: () => {
              return this.body.velocity.y > 0;
            },
          };

    }



    setupMovement(hero) {

        // STATE MACHINE SYSTEM

        // definiamo in primis tutti i possibili cambi di stato del nostro personaggio e il nostro stato iniziale
        // successivamente i metodi associati 
        this.moveState = new StateMachine({
            init: 'standing',
            transitions: [
                { name: 'jump', from: 'standing', to: 'jumping' }, // quando il personaggio salta
                { name: 'flip', from: 'jumping', to: 'flipping' }, // quando il personaggio salta 2 volte
                { name: 'fall', from : 'standing', to: 'falling' }, // quando il personaggio cade
                { name: 'touchdown', from: '*', to: 'standing' }, // quando tocca il piano
            ],
            methods: {
                onEnterState: (lifecycle) => {
                    console.log(lifecycle.from + ' -> ' + lifecycle.to);
            },

                onJump: function() { // quando il personaggio salta
                    hero.body.setVelocityY(-400)
                },
                onFlip: function() { // quando il personaggio salta 2 volte
                    hero.body.setVelocityY(-300);
                },

            }
        });

        // incubatore di metodi per la gestione delle trasizioni
        // se chiamando il metodo dell'azione che vogliamo eseguire il return sarà true allora possiamo eseguire l'azione
        this.movePredicates = {
            jump: () => {
                return this.input.didPressJump;
            },
            flip: () => {
                return this.input.didPressJump;
            },
            fall: () => {
                return !this.body.onFloor();
            },
            touchdown: () => {
                return this.body.onFloor();
            },
        }

    }

    // questo metodo viene chiamato automaticamente ogni secondo dalla scena madre che contiene il nostro personaggio
    preUpdate(time, delta) {
        super.preUpdate(time,delta);

        // teniamo conto di quando il personaggio salta [inserendolo qui avremo ogni singola variazione]
        this.input.didPressJump = Phaser.Input.Keyboard.JustDown(this.keys.up);

        // MOVIMENTO

        // cliccando il tasto sinistro il nostro personaggio si muove a sinistra
        if (this.keys.left.isDown) {
            this.body.setAccelerationX(-250);
            //this.anims.play('hero-run',true); // abilitiamo la riproduzione dell'animazione (il parametro true)
            this.flipX = true; // abilitiamo il flip del nostro sprite (per simulare il movimento a sinistra)
            this.body.offset.x = 8; // ricordando che l'offset definisce la posizione del rectangolo (x,y) per la collisione 8 è la posizione ottimale mentre il nostro character è centrato va verso sinistra
        }
        // cliccando il tasto destro il nostro personaggio si muove a destra
        else if (this.keys.right.isDown) {
            this.body.setAccelerationX(250);
            //this.anims.play('hero-run',true); // abilitiamo la riproduzione dell'animazione (il parametro true)
            this.flipX = false; // disabilitiamo il flip del nostro sprite (per simulare il movimento a destra)
            this.body.offset.x = 12; // ricordando che l'offset definisce la posizione del rectangolo (x,y) per la collisione 12 è la posizione ottimale mentre il nostro character è centrato va verso destra
        }

        // altrimenti il nostro personaggio si ferma
        else {
            this.body.setAccelerationX(0);
            //this.anims.play('hero-idle');
        }

        //: MOVIMENTO


        // SALTO 


        // se si tiene premuto il tasto per saltare il personaggio raggiunge il picco massimo
        // se invece si rilascia subito il click allora si evita di farlo arrivare al picco massimo
        if (this.moveState.is('jumping') || this.moveState.is('flipping')) {
        
            if (!this.keys.up.isDown && this.body.velocity.y < -150) {
                this.body.setVelocityY(-150);
            }

        }


        // per ogni azione che possiamo eseguire in base al nostro stato attuale
        for (const t of this.moveState.transitions()) {
            // se la transizione è valida e il metodo associato è valido
            if (t in this.movePredicates && this.movePredicates[t]()) {
                // eseguiamo l'azione e cambiamo stato
                this.moveState[t]();
                break;
            }
        }


        //: SALTO


        // ANIMAZIONI

        for (const t of this.animState.transitions()) {
            // se la transizione è valida e il metodo associato è valido
            if (t in this.animPredicates && this.animPredicates[t]()) {
                // eseguiamo l'azione e cambiamo stato
                this.animState[t]();
                break;
            }
        }

        // : ANIMAZIONI



    }


}

export default Hero;