# Image Editor with Canvas
This project is a web-based image editor using HTML5 Canvas and JavaScript. It allows users to upload an image and apply various transformations and filters such as grayscale, invert colors, cropping, and rotation. The editor supports mouse interactions for cropping and keyboard controls for rotating the image.

## Features
Image Upload: Load images from your device onto the canvas.

Grayscale Filter: Toggle grayscale effect on the image.

Invert Colors: Toggle color inversion on the image.

Crop: Select and crop a rectangular portion of the image using mouse drag.

Rotate: Rotate the image in 90-degree increments using keyboard arrow keys.

Canvas Resizing: Canvas automatically resizes to fit the image or cropped area.

## How It Works
Image Upload
Uses a file input to select an image.

The image is loaded into an Image object.

Canvas dimensions adjust to the image size.

The image is drawn on the canvas and pixel data is saved for editing and restoring.

Filters
Grayscale: Converts the image pixels to grayscale by averaging RGB values.

Invert: Inverts the colors by subtracting each RGB value from 255.

Both filters toggle on/off and update the canvas accordingly.

Cropping
Click and drag on the canvas to draw a red dashed rectangle indicating the crop area.

On mouse release, the selected area is cropped, canvas resized, and image data updated.

Small crop areas (<5px) are ignored.

Rotation
Press left or right arrow keys to rotate the image by 90 degrees counterclockwise or clockwise.

Rotation adjusts canvas size and redraws the image accordingly.

## Usage
Upload an Image
Click the file input to select an image from your device.

Apply Filters
Call applyGrayscale() or applyInvert() functions (e.g., via buttons) to toggle grayscale or invert filters.

Crop Image
Click and drag on the canvas to select a crop region. Release mouse to crop.

Rotate Image
Use keyboard arrow keys (Left/Right) to rotate the image in 90-degree steps.

## Notes
The canvas context's drawImage() method is used extensively to render images and transformations.

Image pixel manipulation is done via getImageData() and putImageData() for filters and cropping.

Rotation uses an off-screen temporary canvas to handle dimension swaps and rotation transformations.

Mouse events track cropping coordinates and draw a dashed rectangle overlay during selection.

## References
HTML5 Canvas drawImage() method: W3Schools, MDN

Image pixel manipulation with Canvas: MadeByMike

Canvas mouse event handling for cropping and drawing overlays

This image editor provides a foundation for more advanced image processing and editing features using the HTML5 Canvas API.