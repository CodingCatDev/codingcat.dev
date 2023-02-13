---
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/main-codingcatdev-photo/FlutterFlameFlappy.png
excerpt: Spydon teaches Alex and Brittney how to setup and use Flame to build a Flappy Bird clone. 
hashnode: https://hashnode.codingcat.dev/tutorial-flutter-flame-engine-flappy-bird
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=tutorial&selectionSlug=flutter-flame-engine-flappy-bird&_id=795378033f7f4bc7810289bf6b61484a
published: published
slug: flutter-flame-engine-flappy-bird
start: November 21, 2022
title: How to make a Flappy Bird clone with Flutter and Flame Engine
youtube: https://youtu.be/y_0ouvhP8V4
---

Lukas Klingsbo (spydon) teaches Alex and Brittney how to setup and use Flame to build a Flappy Bird clone. In this tutorial we will walk through everything from repo setup to final game.

## Project Setup

We will be using [VSCode](https://code.visualstudio.com/) for this tutorial, you will also want your favorite terminal to get started. Make sure that you have the Flutter [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=Dart-Code.flutter) installed so that you can get support for running [Flutter](https://flutter.dev/). You will also need a git client installed.

## Starting Repo

spydon has provided a starter repo that has everything we will need, it also has the full application incase you get stuck. You can start out on the `dev` branch and build from there.

```bash
git clone -b dev https://github.com/spydon/flappy_ember.git
```

If you get stuck or want to skip to the end just run `git checkout main`.

## File Structure

All of our code can be found in the `lib` directory. All of our sprites and other images will be found in `assets`.

![Untitled](https://media.codingcat.dev/image/upload/v1669175627/main-codingcatdev-photo/d64c4e5e-7244-4633-90ac-276ec0010d72.png)

## Dependencies

In Flutter all of your dependencies are stored in `pubspec.yaml`.  I would recommend changing from the git version to a published version.

```diff
-flame:
-    git:
-      url: https://github.com/flame-engine/flame.git
-      ref: main
-      path: packages/flame
+flame: 1.2.1
```

If you Flutter VSCode extension is running correctly you should now see your packages install / update.

## Programming

### main.dart

This is the file that starts your Flutter application. There is only a small amount of Flutter required in your `main.dart` file. The majority of the setup here is providing the `GameWidget` component an instance of our Flame game.

```dart
import 'package:flame/game.dart';
import 'package:flutter/material.dart';

import 'game.dart';

void main() {
  final game = FlappyEmber();
  runApp(GameWidget(game: game));
}
```

### game.dart

The `FlappyEmber` class is an extension of `FlameGame` which comes form the Flame package. This is essential the main game that we are building, it is where we will import all of the aspects that it takes to create a game like `Player`, `Sky`, `ScreenHitbox` and set all of the variables that are needed to run the game like `speed` and `random`.

```dart
import 'dart:math';

import 'package:flame/components.dart';
import 'package:flame/game.dart';
import 'package:flame/input.dart';
import 'package:flappy_ember/player.dart';

import 'sky.dart';
import 'boxstack.dart';

class FlappyEmber extends FlameGame with TapDetector, HasCollisionDetection {
  late final Player player;
  double speed = 500;
  final random = Random();
  @override
  Future<void>? onLoad() async {
    player = Player();
    add(Sky());
    add(ScreenHitbox());
    add(player);
	  return null;
  }

  void gameover() {
    pauseEngine();
  }

  double _timeSinceBox = 0;
  double _boxInterval = 1;
  @override
  void update(double dt) {
    super.update(dt);
    speed += 10 * dt;
    _timeSinceBox += dt;

    if (_timeSinceBox > _boxInterval) {
      add(BoxStack(isBottom: random.nextBool()));
      _timeSinceBox = 0;
    }
  }

  @override
  void onTap() {
    super.onTap();
    player.fly();
  }
}
```

### player.dart

In the `player.dart` file create a new Class called `Player` this is an extension of `SpriteAnimationComponent` which is a component provided by the flame package for animating our Ember Sprite.

```dart
import 'package:flame/collisions.dart';
import 'package:flame/components.dart';
import 'package:flame/effects.dart';
import 'package:flame/flame.dart';
import 'package:flutter/material.dart';

import 'game.dart';

class Player extends SpriteAnimationComponent
    with CollisionCallbacks, HasGameRef<FlappyEmber> {
  Player() : super(size: Vector2(100, 100), position: Vector2(100, 100));

  @override
  Future<void>? onLoad() async {
    add(CircleHitbox());

    final image = await Flame.images.load('ember.png');
    animation = SpriteAnimation.fromFrameData(
      image,
      SpriteAnimationData.sequenced(
        amount: 4,
        stepTime: 0.10,
        textureSize: Vector2.all(16),
      ),
    );
  }

  @override
  void onCollisionStart(_, __) {
    super.onCollisionStart(_, __);
    gameRef.gameover();
  }

  @override
  void update(double dt) {
    super.update(dt);

    position.y += 200 * dt;
  }

  void fly() {
    final effect = MoveByEffect(
        Vector2(0, -100),
        EffectController(
          duration: 0.5,
          curve: Curves.decelerate,
        ));

    add(effect);
  }
}
```

### sky.dart

This is a fairly simple component called `Sky` that extends the `SpriteComponent` from Flame. Its only job is to load the parallax background.

```dart
import 'package:flame/components.dart';
import 'package:flame/flame.dart';

class Sky extends SpriteComponent {
  Sky() : super(priority: -1);

  @override
  Future<void>? onLoad() async {
    final image = await Flame.images.load('./parallax/bg_sky.png');

    sprite = Sprite(image);
  }

  @override
  void onGameResize(Vector2 size) {
    super.onGameResize(size);

    this.size = size;
  }
}
```

### box.dart

The `Box` component is equally as easy as `Sky`, with one small difference that we also add a `RectangleHitbox` so that when our ember runs into the box we understand that it has struck the box.

```dart
import 'package:flame/collisions.dart';
import 'package:flame/components.dart';
import 'package:flame/widgets.dart';
import 'package:flame/flame.dart';

class Box extends SpriteComponent {
  static Vector2 initialSize = Vector2.all(150);
  Box({super.position}) : super(size: initialSize);

  @override
  Future<void>? onLoad() async {
    final image = await Flame.images.load('./boxes/1.png');

    sprite = Sprite(image);

    add(RectangleHitbox());
  }
}
```

### boxstack.dart

The `BoxStack` component extends `PositionComponent` and also uses the game that we created called `FlappyEmber` for a reference. This is massively useful as we can calculate things like `gameHeight` directly from the `gameRef.size.y` of the instance. This allows you to calculate how many boxes can be stacked randomly while still fitting within the boundaries of the game.

```dart
import 'dart:math';

import 'package:flame/collisions.dart';
import 'package:flame/components.dart';
import 'package:flame/widgets.dart';
import 'package:flame/flame.dart';

import 'game.dart';
import 'box.dart';

class BoxStack extends PositionComponent with HasGameRef<FlappyEmber> {
  final bool isBottom;
  static final random = Random();

  BoxStack({required this.isBottom});

  @override
  Future<void>? onLoad() async {
    position.x = gameRef.size.x;
    final gameHeight = gameRef.size.y;
    final boxHeight = Box.initialSize.y;
    final maxStackHeight = (gameHeight / boxHeight).floor() - 2;

    final stackHeight = random.nextInt(maxStackHeight + 1);
    final boxSpacing = boxHeight * (2 / 3);
    final initialY = isBottom ? gameHeight - boxHeight : -boxHeight / 3;

    final boxs = List.generate(stackHeight, (index) {
      return Box(
        position:
            Vector2(0, initialY + index * boxSpacing * (isBottom ? -1 : 1)),
      );
    });
    addAll(isBottom ? boxs : boxs.reversed);
  }

  @override
  void update(double dt) {
    super.update(dt);
    if (position.x < -Box.initialSize.x) {
      removeFromParent();
    }
    position.x -= gameRef.speed * dt;
  }
}
```

## Testing the Game

Throughout this process you most likely will want to debug the game. Once again have the VSCode Flutter plugin this is made super simple. All you need to do is be in any of the the files in the source directory and use the run and debug screen like normal and this will build out your desktop or mobile version of the game. 
 

![Untitled](https://media.codingcat.dev/image/upload/v1669175626/main-codingcatdev-photo/ba6c7386-67ff-4488-ac4e-d19d0ed4853a.png)