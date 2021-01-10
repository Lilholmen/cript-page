'use strict';
//-------------------------initialize section-------------------------------------
const settingsButton = document.getElementById('settings');
const regularButtonContainer = document.querySelector('.menu__container--btn');
const criptSettingsContainer = document.querySelector(
  '.menu__container--settings'
);

const decreaseButton = document.getElementById('steps-decrease');
const stepsCounter = document.getElementById('steps-counter');
const increaseButton = document.getElementById('steps-increase');
const keyWordInput = document.getElementById('keyWord');
const criptButton = document.getElementById('cript');
const decriptButton = document.getElementById('decript');
const clearButton = document.getElementById('clear');
const copyButton = document.getElementById('copy');
const pasteButton = document.getElementById('paste');

const inputArea = document.getElementById('input-area');
const resultArea = document.getElementById('result-area');
//-------------------------Cript class declaration-------------------------------------
class Cript {
  constructor() {
    this.text = '';

    this.getInput = function (str) {
      this.text = String(str.trim());
    };

    this.logText = function () {
      console.log(this.text);
    };

    this.parseBigInt = function () {
      this.text = BigInt(
        this.text
          .split('')
          .map((letter) => {
            let to4 = letter.charCodeAt(0);
            return to4 > 999
              ? to4
              : to4 > 99
              ? `0${to4}`
              : to4 > 31
              ? `00${to4}`
              : `0013`;
          })
          .join('')
      );
    };

    this.to36Base = function () {
      this.text = this.text.toString(36);
    };

    this.encript = function (steps = 1, key = 1) {
      for (let i = 0; i < steps; i++) {
        this.parseBigInt();
        this.text = BigInt(this.text) * BigInt(key);
        this.to36Base();
      }
    };

    this.decript = function (steps = 1, key = 1) {
      let arrUTF = [];
      for (let i = 0; i < steps; i++) {
        let len = this.text.length - 1;
        this.text = (
          this.text
            .split('')
            .map((letter) => BigInt(parseInt(letter, 36)))
            .reduce(
              (acc, cur, index) => acc + cur * 36n ** BigInt(len - index),
              0n
            ) / BigInt(key)
        ).toString(10);
        while (this.text.length % 4 !== 0) {
          this.text = '0' + this.text;
        }
        for (let i = 0; i <= this.text.length - 1; i += 4) {
          arrUTF.push(this.text.substring(i, i + 4));
        }

        this.text = arrUTF.map((code) => String.fromCharCode(code)).join('');
        arrUTF = [];
      }
    };

    this.run = function () {
      //console demonstration
      this.getInput('jopa вапвапавп dsfdsfdsf 12121sdfsdf f!!3');
      this.logText();
      this.encript(
        3,
        generateKeyWord('jopa вапвапавп dsfdsfdsf 12121sdfsdf f!!3')
      );
      this.logText();
      this.decript(
        3,
        generateKeyWord('jopa вапвапавп dsfdsfdsf 12121sdfsdf f!!3')
      );
      this.logText();
    };
  }
}
//-------------------------initialize object-------------------------------------
const test = new Cript();

function generateKeyWord(keyWord) {
  if (!keyWord) return 1;
  return BigInt(
    keyWord
      .split('')
      .map((letter) => {
        let to4 = letter.charCodeAt(0);
        return to4 > 999
          ? to4
          : to4 > 99
          ? `0${to4}`
          : to4 > 31
          ? `00${to4}`
          : `0013`;
      })
      .join('')
  );
}
//-------------------------add event listeners-------------------------------------
criptButton.addEventListener('click', () => {
  test.getInput(inputArea.value);
  if (test.text !== '') {
    test.encript(stepsCounter.textContent, generateKeyWord(keyWordInput.value));
    resultArea.value = test.text;
    test.text = '';
  }
});

copyButton.addEventListener('click', () => {
  if (resultArea.value) {
    navigator.clipboard
      .writeText(resultArea.value)
      .then(() => {
        resultArea.value = '';
      })
      .catch((err) => {
        console.log('Something went wrong', err);
      });
  }
});

clearButton.addEventListener('click', () => {
  inputArea.value = '';
  resultArea.value = '';
});

pasteButton.addEventListener('click', () => {
  navigator.clipboard
    .readText()
    .then((text) => {
      inputArea.value = text;
    })
    .catch((err) => {
      console.log('Something went wrong', err);
    });
});

decriptButton.addEventListener('click', () => {
  test.getInput(inputArea.value);
  if (test.text !== '') {
    test.decript(stepsCounter.textContent, generateKeyWord(keyWordInput.value));
    resultArea.value = test.text;
    test.text = '';
  }
});

settingsButton.addEventListener('click', () => {
  const displayStates = ['none', 'inline-block'];
  criptSettingsContainer.style.display =
    displayStates[+(criptSettingsContainer.style.display === 'none')];
  regularButtonContainer.style.display =
    displayStates[+(criptSettingsContainer.style.display !== 'inline-block')];
});

increaseButton.addEventListener('click', () => {
  if (stepsCounter.textContent < 9) {
    stepsCounter.textContent++;
  }
});

decreaseButton.addEventListener('click', () => {
  if (stepsCounter.textContent > 1) {
    stepsCounter.textContent--;
  }
});
