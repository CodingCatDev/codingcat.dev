---
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1600704494/ccd-cloudinary/ionic_icons_everywhere.png
devto: https://dev.to/codingcatdev/ionic-icons-1e07
excerpt: How can you use Ionic Icons, anywhere and everywhere?
hashnode: https://hashnode.codingcat.dev/post-ionic-icons
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=post&selectionSlug=ionic-icons&_id=309d7eae5e7842b7b06052b785ffa212
published: published
slug: ionic-icons
start: January 20, 2019
title: Ionic Icons
---
You can just add the unpkg tag to your head?

Demo: [https://ion-icon.firebaseapp.com/](https://ion-icon.firebaseapp.com/)

# Ionic Icon Links

Main Page: [https://ionicons.com/](https://ionicons.com/) Git Repo: [https://github.com/ionic-team/ionicons](https://github.com/ionic-team/ionicons)

```html
<html>
  <head>
    <meta charset="UTF-8" />
    <script
      type="text/javascript"
      src="https://unpkg.com/ionicons@latest/dist/ionicons.js"
    ></script>
    <style>
      .flexcontainer {
        display: -webkit-flex;
        display: flex;
        -webkit-align-items: center;
        align-items: center;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-flex-direction: row wrap;
        flex-direction: column;
        /* tweak the where items line up on the row */
        /* valid values are: flex-start, flex-end, space-between, space-around, stretch */
        -webkit-align-content: space-around;
        align-content: space-around;
        flex-shrink: 0;
      }

      .flex {
        flex-shrink: 0;
      }
    </style>
  </head>

  <body class="flexcontainer">
    <span class="flex">
      <p style="float:left">add</p>
      <ion-icon name="add" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">add-circle</p>
      <ion-icon name="add-circle" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">alarm</p>
      <ion-icon name="alarm" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">albums</p>
      <ion-icon name="albums" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">alert</p>
      <ion-icon name="alert" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">american-football</p>
      <ion-icon name="american-football" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">analytics</p>
      <ion-icon name="analytics" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">aperture</p>
      <ion-icon name="aperture" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">apps</p>
      <ion-icon name="apps" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">appstore</p>
      <ion-icon name="appstore" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">archive</p>
      <ion-icon name="archive" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">arrow-back</p>
      <ion-icon name="arrow-back" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">arrow-down</p>
      <ion-icon name="arrow-down" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">arrow-dropdown</p>
      <ion-icon name="arrow-dropdown" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">arrow-dropdown-circle</p>
      <ion-icon name="arrow-dropdown-circle" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">arrow-dropleft</p>
      <ion-icon name="arrow-dropleft" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">arrow-dropleft-circle</p>
      <ion-icon name="arrow-dropleft-circle" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">arrow-dropright</p>
      <ion-icon name="arrow-dropright" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">arrow-dropright-circle</p>
      <ion-icon name="arrow-dropright-circle" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">arrow-dropup</p>
      <ion-icon name="arrow-dropup" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">arrow-dropup-circle</p>
      <ion-icon name="arrow-dropup-circle" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">arrow-forward</p>
      <ion-icon name="arrow-forward" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">arrow-round-back</p>
      <ion-icon name="arrow-round-back" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">arrow-round-down</p>
      <ion-icon name="arrow-round-down" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">arrow-round-forward</p>
      <ion-icon name="arrow-round-forward" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">arrow-round-up</p>
      <ion-icon name="arrow-round-up" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">arrow-up</p>
      <ion-icon name="arrow-up" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">at</p>
      <ion-icon name="at" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">attach</p>
      <ion-icon name="attach" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">backspace</p>
      <ion-icon name="backspace" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">barcode</p>
      <ion-icon name="barcode" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">baseball</p>
      <ion-icon name="baseball" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">basket</p>
      <ion-icon name="basket" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">basketball</p>
      <ion-icon name="basketball" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">battery-charging</p>
      <ion-icon name="battery-charging" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">battery-dead</p>
      <ion-icon name="battery-dead" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">battery-full</p>
      <ion-icon name="battery-full" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">beaker</p>
      <ion-icon name="beaker" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">beer</p>
      <ion-icon name="beer" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">bicycle</p>
      <ion-icon name="bicycle" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">bluetooth</p>
      <ion-icon name="bluetooth" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">boat</p>
      <ion-icon name="boat" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">body</p>
      <ion-icon name="body" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">bonfire</p>
      <ion-icon name="bonfire" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">book</p>
      <ion-icon name="book" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">bookmark</p>
      <ion-icon name="bookmark" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">bookmarks</p>
      <ion-icon name="bookmarks" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">bowtie</p>
      <ion-icon name="bowtie" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">briefcase</p>
      <ion-icon name="briefcase" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">browsers</p>
      <ion-icon name="browsers" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">brush</p>
      <ion-icon name="brush" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">bug</p>
      <ion-icon name="bug" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">build</p>
      <ion-icon name="build" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">bulb</p>
      <ion-icon name="bulb" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">bus</p>
      <ion-icon name="bus" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">cafe</p>
      <ion-icon name="cafe" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">calculator</p>
      <ion-icon name="calculator" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">calendar</p>
      <ion-icon name="calendar" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">call</p>
      <ion-icon name="call" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">camera</p>
      <ion-icon name="camera" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">car</p>
      <ion-icon name="car" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">card</p>
      <ion-icon name="card" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">cart</p>
      <ion-icon name="cart" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">cash</p>
      <ion-icon name="cash" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">chatboxes</p>
      <ion-icon name="chatboxes" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">chatbubbles</p>
      <ion-icon name="chatbubbles" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">checkbox</p>
      <ion-icon name="checkbox" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">checkbox-outline</p>
      <ion-icon name="checkbox-outline" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">checkmark</p>
      <ion-icon name="checkmark" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">checkmark-circle</p>
      <ion-icon name="checkmark-circle" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">checkmark-circle-outline</p>
      <ion-icon name="checkmark-circle-outline" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">clipboard</p>
      <ion-icon name="clipboard" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">clock</p>
      <ion-icon name="clock" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">close</p>
      <ion-icon name="close" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">close-circle</p>
      <ion-icon name="close-circle" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">closed-captioning</p>
      <ion-icon name="closed-captioning" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">cloud</p>
      <ion-icon name="cloud" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">cloud-circle</p>
      <ion-icon name="cloud-circle" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">cloud-done</p>
      <ion-icon name="cloud-done" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">cloud-download</p>
      <ion-icon name="cloud-download" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">cloud-outline</p>
      <ion-icon name="cloud-outline" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">cloud-upload</p>
      <ion-icon name="cloud-upload" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">cloudy</p>
      <ion-icon name="cloudy" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">cloudy-night</p>
      <ion-icon name="cloudy-night" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">code</p>
      <ion-icon name="code" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">code-download</p>
      <ion-icon name="code-download" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">code-working</p>
      <ion-icon name="code-working" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">cog</p>
      <ion-icon name="cog" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">color-fill</p>
      <ion-icon name="color-fill" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">color-filter</p>
      <ion-icon name="color-filter" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">color-palette</p>
      <ion-icon name="color-palette" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">color-wand</p>
      <ion-icon name="color-wand" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">compass</p>
      <ion-icon name="compass" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">construct</p>
      <ion-icon name="construct" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">contact</p>
      <ion-icon name="contact" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">contacts</p>
      <ion-icon name="contacts" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">contract</p>
      <ion-icon name="contract" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">contrast</p>
      <ion-icon name="contrast" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">copy</p>
      <ion-icon name="copy" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">create</p>
      <ion-icon name="create" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">crop</p>
      <ion-icon name="crop" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">cube</p>
      <ion-icon name="cube" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">cut</p>
      <ion-icon name="cut" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">desktop</p>
      <ion-icon name="desktop" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">disc</p>
      <ion-icon name="disc" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">document</p>
      <ion-icon name="document" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">done-all</p>
      <ion-icon name="done-all" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">download</p>
      <ion-icon name="download" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">easel</p>
      <ion-icon name="easel" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">egg</p>
      <ion-icon name="egg" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">exit</p>
      <ion-icon name="exit" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">expand</p>
      <ion-icon name="expand" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">eye</p>
      <ion-icon name="eye" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">eye-off</p>
      <ion-icon name="eye-off" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">fastforward</p>
      <ion-icon name="fastforward" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">female</p>
      <ion-icon name="female" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">filing</p>
      <ion-icon name="filing" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">film</p>
      <ion-icon name="film" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">finger-print</p>
      <ion-icon name="finger-print" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">flag</p>
      <ion-icon name="flag" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">flame</p>
      <ion-icon name="flame" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">flash</p>
      <ion-icon name="flash" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">flask</p>
      <ion-icon name="flask" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">flower</p>
      <ion-icon name="flower" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">folder</p>
      <ion-icon name="folder" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">folder-open</p>
      <ion-icon name="folder-open" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">football</p>
      <ion-icon name="football" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">funnel</p>
      <ion-icon name="funnel" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">game-controller-a</p>
      <ion-icon name="game-controller-a" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">game-controller-b</p>
      <ion-icon name="game-controller-b" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">git-branch</p>
      <ion-icon name="git-branch" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">git-commit</p>
      <ion-icon name="git-commit" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">git-compare</p>
      <ion-icon name="git-compare" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">git-merge</p>
      <ion-icon name="git-merge" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">git-network</p>
      <ion-icon name="git-network" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">git-pull-request</p>
      <ion-icon name="git-pull-request" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">glasses</p>
      <ion-icon name="glasses" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">globe</p>
      <ion-icon name="globe" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">grid</p>
      <ion-icon name="grid" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">hammer</p>
      <ion-icon name="hammer" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">hand</p>
      <ion-icon name="hand" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">happy</p>
      <ion-icon name="happy" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">headset</p>
      <ion-icon name="headset" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">heart</p>
      <ion-icon name="heart" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">heart-outline</p>
      <ion-icon name="heart-outline" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">help</p>
      <ion-icon name="help" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">help-buoy</p>
      <ion-icon name="help-buoy" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">help-circle</p>
      <ion-icon name="help-circle" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">home</p>
      <ion-icon name="home" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">ice-cream</p>
      <ion-icon name="ice-cream" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">image</p>
      <ion-icon name="image" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">images</p>
      <ion-icon name="images" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">infinite</p>
      <ion-icon name="infinite" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">information</p>
      <ion-icon name="information" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">information-circle</p>
      <ion-icon name="information-circle" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">ionic</p>
      <ion-icon name="ionic" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">ionitron</p>
      <ion-icon name="ionitron" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">jet</p>
      <ion-icon name="jet" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">key</p>
      <ion-icon name="key" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">keypad</p>
      <ion-icon name="keypad" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">laptop</p>
      <ion-icon name="laptop" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">leaf</p>
      <ion-icon name="leaf" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">link</p>
      <ion-icon name="link" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">list</p>
      <ion-icon name="list" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">list-box</p>
      <ion-icon name="list-box" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">locate</p>
      <ion-icon name="locate" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">lock</p>
      <ion-icon name="lock" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">log-in</p>
      <ion-icon name="log-in" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">log-out</p>
      <ion-icon name="log-out" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-android</p>
      <ion-icon name="logo-android" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-angular</p>
      <ion-icon name="logo-angular" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-apple</p>
      <ion-icon name="logo-apple" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-bitcoin</p>
      <ion-icon name="logo-bitcoin" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-buffer</p>
      <ion-icon name="logo-buffer" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-chrome</p>
      <ion-icon name="logo-chrome" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-codepen</p>
      <ion-icon name="logo-codepen" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-css3</p>
      <ion-icon name="logo-css3" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-designernews</p>
      <ion-icon name="logo-designernews" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-dribbble</p>
      <ion-icon name="logo-dribbble" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-dropbox</p>
      <ion-icon name="logo-dropbox" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-euro</p>
      <ion-icon name="logo-euro" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-facebook</p>
      <ion-icon name="logo-facebook" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-foursquare</p>
      <ion-icon name="logo-foursquare" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-freebsd-devil</p>
      <ion-icon name="logo-freebsd-devil" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-github</p>
      <ion-icon name="logo-github" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-google</p>
      <ion-icon name="logo-google" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-googleplus</p>
      <ion-icon name="logo-googleplus" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-hackernews</p>
      <ion-icon name="logo-hackernews" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-html5</p>
      <ion-icon name="logo-html5" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-instagram</p>
      <ion-icon name="logo-instagram" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-javascript</p>
      <ion-icon name="logo-javascript" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-linkedin</p>
      <ion-icon name="logo-linkedin" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-markdown</p>
      <ion-icon name="logo-markdown" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-nodejs</p>
      <ion-icon name="logo-nodejs" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-octocat</p>
      <ion-icon name="logo-octocat" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-pinterest</p>
      <ion-icon name="logo-pinterest" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-playstation</p>
      <ion-icon name="logo-playstation" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-python</p>
      <ion-icon name="logo-python" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-reddit</p>
      <ion-icon name="logo-reddit" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-rss</p>
      <ion-icon name="logo-rss" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-sass</p>
      <ion-icon name="logo-sass" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-skype</p>
      <ion-icon name="logo-skype" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-snapchat</p>
      <ion-icon name="logo-snapchat" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-steam</p>
      <ion-icon name="logo-steam" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-tumblr</p>
      <ion-icon name="logo-tumblr" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-twitch</p>
      <ion-icon name="logo-twitch" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-twitter</p>
      <ion-icon name="logo-twitter" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-usd</p>
      <ion-icon name="logo-usd" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-vimeo</p>
      <ion-icon name="logo-vimeo" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-whatsapp</p>
      <ion-icon name="logo-whatsapp" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-windows</p>
      <ion-icon name="logo-windows" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-wordpress</p>
      <ion-icon name="logo-wordpress" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-xbox</p>
      <ion-icon name="logo-xbox" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-yahoo</p>
      <ion-icon name="logo-yahoo" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-yen</p>
      <ion-icon name="logo-yen" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">logo-youtube</p>
      <ion-icon name="logo-youtube" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">magnet</p>
      <ion-icon name="magnet" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">mail</p>
      <ion-icon name="mail" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">mail-open</p>
      <ion-icon name="mail-open" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">male</p>
      <ion-icon name="male" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">man</p>
      <ion-icon name="man" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">map</p>
      <ion-icon name="map" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">medal</p>
      <ion-icon name="medal" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">medical</p>
      <ion-icon name="medical" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">medkit</p>
      <ion-icon name="medkit" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">megaphone</p>
      <ion-icon name="megaphone" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">menu</p>
      <ion-icon name="menu" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">mic</p>
      <ion-icon name="mic" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">mic-off</p>
      <ion-icon name="mic-off" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">microphone</p>
      <ion-icon name="microphone" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">moon</p>
      <ion-icon name="moon" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">more</p>
      <ion-icon name="more" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">move</p>
      <ion-icon name="move" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">musical-note</p>
      <ion-icon name="musical-note" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">musical-notes</p>
      <ion-icon name="musical-notes" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">navigate</p>
      <ion-icon name="navigate" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">no-smoking</p>
      <ion-icon name="no-smoking" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">notifications</p>
      <ion-icon name="notifications" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">notifications-off</p>
      <ion-icon name="notifications-off" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">notifications-outline</p>
      <ion-icon name="notifications-outline" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">nuclear</p>
      <ion-icon name="nuclear" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">nutrition</p>
      <ion-icon name="nutrition" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">open</p>
      <ion-icon name="open" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">options</p>
      <ion-icon name="options" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">outlet</p>
      <ion-icon name="outlet" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">paper</p>
      <ion-icon name="paper" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">paper-plane</p>
      <ion-icon name="paper-plane" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">partly-sunny</p>
      <ion-icon name="partly-sunny" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">pause</p>
      <ion-icon name="pause" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">paw</p>
      <ion-icon name="paw" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">people</p>
      <ion-icon name="people" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">person</p>
      <ion-icon name="person" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">person-add</p>
      <ion-icon name="person-add" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">phone-landscape</p>
      <ion-icon name="phone-landscape" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">phone-portrait</p>
      <ion-icon name="phone-portrait" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">photos</p>
      <ion-icon name="photos" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">pie</p>
      <ion-icon name="pie" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">pin</p>
      <ion-icon name="pin" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">pint</p>
      <ion-icon name="pint" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">pizza</p>
      <ion-icon name="pizza" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">plane</p>
      <ion-icon name="plane" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">planet</p>
      <ion-icon name="planet" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">play</p>
      <ion-icon name="play" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">podium</p>
      <ion-icon name="podium" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">power</p>
      <ion-icon name="power" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">pricetag</p>
      <ion-icon name="pricetag" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">pricetags</p>
      <ion-icon name="pricetags" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">print</p>
      <ion-icon name="print" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">pulse</p>
      <ion-icon name="pulse" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">qr-scanner</p>
      <ion-icon name="qr-scanner" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">quote</p>
      <ion-icon name="quote" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">radio</p>
      <ion-icon name="radio" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">radio-button-off</p>
      <ion-icon name="radio-button-off" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">radio-button-on</p>
      <ion-icon name="radio-button-on" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">rainy</p>
      <ion-icon name="rainy" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">recording</p>
      <ion-icon name="recording" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">redo</p>
      <ion-icon name="redo" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">refresh</p>
      <ion-icon name="refresh" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">refresh-circle</p>
      <ion-icon name="refresh-circle" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">remove</p>
      <ion-icon name="remove" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">remove-circle</p>
      <ion-icon name="remove-circle" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">reorder</p>
      <ion-icon name="reorder" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">repeat</p>
      <ion-icon name="repeat" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">resize</p>
      <ion-icon name="resize" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">restaurant</p>
      <ion-icon name="restaurant" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">return-left</p>
      <ion-icon name="return-left" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">return-right</p>
      <ion-icon name="return-right" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">reverse-camera</p>
      <ion-icon name="reverse-camera" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">rewind</p>
      <ion-icon name="rewind" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">ribbon</p>
      <ion-icon name="ribbon" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">rose</p>
      <ion-icon name="rose" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">sad</p>
      <ion-icon name="sad" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">school</p>
      <ion-icon name="school" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">search</p>
      <ion-icon name="search" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">send</p>
      <ion-icon name="send" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">settings</p>
      <ion-icon name="settings" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">share</p>
      <ion-icon name="share" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">share-alt</p>
      <ion-icon name="share-alt" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">shirt</p>
      <ion-icon name="shirt" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">shuffle</p>
      <ion-icon name="shuffle" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">skip-backward</p>
      <ion-icon name="skip-backward" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">skip-forward</p>
      <ion-icon name="skip-forward" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">snow</p>
      <ion-icon name="snow" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">speedometer</p>
      <ion-icon name="speedometer" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">square</p>
      <ion-icon name="square" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">square-outline</p>
      <ion-icon name="square-outline" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">star</p>
      <ion-icon name="star" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">star-half</p>
      <ion-icon name="star-half" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">star-outline</p>
      <ion-icon name="star-outline" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">stats</p>
      <ion-icon name="stats" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">stopwatch</p>
      <ion-icon name="stopwatch" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">subway</p>
      <ion-icon name="subway" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">sunny</p>
      <ion-icon name="sunny" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">swap</p>
      <ion-icon name="swap" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">switch</p>
      <ion-icon name="switch" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">sync</p>
      <ion-icon name="sync" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">tablet-landscape</p>
      <ion-icon name="tablet-landscape" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">tablet-portrait</p>
      <ion-icon name="tablet-portrait" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">tennisball</p>
      <ion-icon name="tennisball" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">text</p>
      <ion-icon name="text" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">thermometer</p>
      <ion-icon name="thermometer" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">thumbs-down</p>
      <ion-icon name="thumbs-down" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">thumbs-up</p>
      <ion-icon name="thumbs-up" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">thunderstorm</p>
      <ion-icon name="thunderstorm" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">time</p>
      <ion-icon name="time" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">timer</p>
      <ion-icon name="timer" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">train</p>
      <ion-icon name="train" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">transgender</p>
      <ion-icon name="transgender" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">trash</p>
      <ion-icon name="trash" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">trending-down</p>
      <ion-icon name="trending-down" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">trending-up</p>
      <ion-icon name="trending-up" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">trophy</p>
      <ion-icon name="trophy" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">tux</p>
      <ion-icon name="tux" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">umbrella</p>
      <ion-icon name="umbrella" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">undo</p>
      <ion-icon name="undo" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">unlock</p>
      <ion-icon name="unlock" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">videocam</p>
      <ion-icon name="videocam" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">volume-down</p>
      <ion-icon name="volume-down" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">volume-mute</p>
      <ion-icon name="volume-mute" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">volume-off</p>
      <ion-icon name="volume-off" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">volume-up</p>
      <ion-icon name="volume-up" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">walk</p>
      <ion-icon name="walk" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">warning</p>
      <ion-icon name="warning" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">watch</p>
      <ion-icon name="watch" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">water</p>
      <ion-icon name="water" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">wifi</p>
      <ion-icon name="wifi" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">wine</p>
      <ion-icon name="wine" size="small"></ion-icon>
    </span>
    <span class="flex">
      <p style="float:left">woman</p>
      <ion-icon name="woman" size="small"></ion-icon>
    </span>
  </body>
</html>
```