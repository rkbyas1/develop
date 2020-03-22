'use strict';
{

    let SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
    if ('SpeechRecognition' in window) {
      // ユーザのブラウザは音声合成に対応しています。
      console.log('ユーザのブラウザは音声合成に対応しています。')
    } else {
      // ユーザのブラウザは音声合成に対応していません。
      console.log('ユーザのブラウザは音声合成に対応していません。');
    }

}