const express = require('express');
const app = express();
const fs = require('fs');
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const path = require('path');
const fetch = require('node-fetch');
const ffmpeg = require('fluent-ffmpeg');

app.get('/', (req,res) => res.send("OK"))
app.get('/info/:id', async (req,res) => {
  try {
    var query = req.params.id;
    if(!query)return res.send({
      title: 'Rythm'
    });
    var result = await yts(`${query} lyrics`);
    if(!result?.videos)return res.send({
      title: '404 Not Found'
    });
    var video = result?.videos[0];
    if(!video || !video.url)return res.send({
      title: '404 Not Found'
    });
    res.send(video);
  }catch(e) {
    return res.send({
      title: 'Something Went Wrong'
    });
  }
})

app.get('/music', async (req,res) => {
  try {
    var query = req.query.q;
    if(!query)return res.send(400).send({
      message: 'Please provide a query'
    });
    var result = await yts(`${query} lyrics`);
    if(!result?.videos)return res.send(404).send({
      message: '404 Not Found'
    });
    var video = result?.videos[0];
    if(!video || !video.url)return res.send(404).send({
      message: '404 Not Found'
    });
  var url = video?.url;

    if(query.startsWith('https://youtu.be/')) url = query;
   const stream = ytdl(url, {
     filter: 'audioonly'
   });
    stream.pipe(res);
      }catch(e) {
    return res.status(404).send({
      message: 'Something Went Wrong'
    })
  }
})

app.listen(3000)
