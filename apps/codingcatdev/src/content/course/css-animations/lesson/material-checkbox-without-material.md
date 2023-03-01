---
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1655996676/main-codingcatdev-photo/Material%20Checkbox%20without%20Material.png
excerpt: In this video we review the opacity property.
published: draft
slug: material-checkbox-without-material
start: June 11, 2022
title: Material Checkbox without Material
weight: 2
youtube: https://youtu.be/xEttLCcdX_4
---

The main HTML is very simple, having just two key elements `input` and `span`.

```html
<label>
  <input type="checkbox" />
  <span class="checkbox"></span>
</label>
```

In order to create the checkmark it is nothing more than a bottom, and left border colored green. The key here is that it is then rotated `45deg` to make it look like a check mark.

```css
input:checked ~ .checkbox {
  transform: rotate(45deg);
  height: 125px;
  width: 50px;
  margin-left: 50px;
  border-color: green;
  border-top-color: transparent;
  border-left-color: transparent;
  border-radius: 0;
}
```

You will notice that in the below [Codepen](https://codepen.io/codercatdev/pen/vYdpGNW) there is some JavaScript, this is just for updating the text to say `true` or `false`. 

[https://codepen.io/codercatdev/pen/vYdpGNW](https://codepen.io/codercatdev/pen/vYdpGNW)