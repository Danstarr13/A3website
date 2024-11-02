//These are just some general variable declarations used further down
const html = document.documentElement;
const body = document.getElementById('bottom');
const canvas = document.getElementById("anim");
const context = canvas.getContext("2d");

//--START OF FRAME ANIMATION CODE--
//This chunk sets up the algorithm for navigating the directory containing all of the individual images in the animation
const frameCount = 88;
const currentFrame = index => (
  `animations/abyss/abyssAnim${index.toString().padStart(4, '0')}.jpg` //Takes in the custom naming convention used for the images and then appends four digits at the end to retrieve a single frame
)
//Loops through all images in the sequence
const preloadImages = () => {
  for (let i = 1; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
  }
};
//Create an image object, set the image source to the first frame when page loads, set height and width of the canvas
const img = new Image()
img.src = currentFrame(1);
canvas.width=1920;
canvas.height=1080;
img.onload=function(){
  context.drawImage(img, 0, 0);
}
//Update the image with a given index (the current scroll position rounded up to nearest whole number between 0 and frameCount)
const updateImage = index => {
  img.src = currentFrame(index);
  context.drawImage(img, 0, 0);
}
//When a scroll event is detected, retrieve the corresponding frame in the image sequence and update the image displayed on the canvas
window.addEventListener('scroll', () => {  
    //These variables control what point the animation should start and end, here it's just starting at the top and ending at the bottom
    const scrollTop = html.scrollTop;
    const maxScrollTop = html.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScrollTop;
    const frameIndex = Math.min(
        frameCount - 1, //avoid off-by-1 errors because arrays always start at 0 not 1
        Math.ceil(scrollFraction * frameCount) //turns a decimal scroll position into the nearest whole number so as to always find an exact corresponding frame
    );
  //Update the canvas with the new image
  requestAnimationFrame(() => updateImage(frameIndex + 1))
});

preloadImages()//This lightens the load for slower devices by preloading all the images, which in turn leads to smoother animation playback
//--END OF FRAME ANIMATION CODE--

//--START OF OBSERVER CODE--
//This section of code is watching for when a certain document element enters and leaves the viewport, then firing off events when that happens
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const square = document.querySelector('.anim'); //The element that needs to enter the viewport
  
        //When an intersection begins, trigger this code
        if (entry.isIntersecting) {
            square.classList.add('idle');
            square.classList.add('zoom');
            clearInterval(fadeOut); //This line is needed in the case that a fadeOut event is still happening when a fadeIn event is triggered, otherwise both events would be fighting eachother to update values
            T1 = setTimeout(()=> { //This sets a latent event to trigger after 3 seconds and assigns it a variable so that it can be cleared in the event the user scrolls back up and cancels the intersection before the 3 seconds are up
                audio.play();
                fadeIn = setInterval(
                    //Ramps volume up when a fadeIn event is triggered
                    function() {
                        if (vol < 1) {
                            vol += 0.05;
                            audio.volume = vol;
                        }
                        else {
                            audio.volume = 1; //For some reason, javascript doesn't like when the value reaches exactly 0 or 1 and throws an error saying the value is out of range between 0 and 1 even though it isn't, because of this the value would only ever reach 0.05 and 0.95 so I had to add a final line to set the volume to 1
                            clearInterval(fadeIn);
                        }
                    }, interval);
            },3000); //Delay for the event
            return;
        }
        //When an intersection ends, trigger this code
        square.classList.remove('idle');
        square.classList.remove('zoom');
        clearInterval(fadeIn); //This line is needed in the case that a fadeIn event is still happening when a fadeOut event is triggered, otherwise both events would be fighting eachother to update values
        fadeOut = setInterval(
            //Ramps volume down when a fadeOut event is triggered
            function() {
                if (vol > 0) {
                    vol -= 0.05;
                    audio.volume = vol;
                }
                else {
                    audio.volume = 0; //For some reason, javascript doesn't like when the value reaches exactly 0 or 1 and throws an error saying the value is out of range between 0 and 1 even though it isn't, because of this the value would only ever reach 0.05 and 0.95 so I had to add a final line to set the volume to 1
                    clearInterval(fadeOut);
                }
            }, interval);
        clearTimeout(T1);//Because the delay is only required when turning the volume up, we don't need a latent timeout for fading the volume down, it happens immediately when the user leaves the intersection, we just need to clear any active latent events that haven't triggered yet
    });
});
  
observer.observe(document.querySelector('.bottomOfPage'));
//--END OF OBSERVER CODE--

//--START OF REVIEW CHANGING CODE--
var images = new Array();
for (var i = 1; i < 5; i++) {
   images.push("images/Review" + i + ".png"); //Adds all of the review images into a single array
}
var x = 0;
//Function for changing the review image
function changeImage() {
    document.getElementById('reviews').src = images[x];//Sets a new review image based on an index to reference the images array
    //This conditional prepares the x variable for updating the review image the next time the function is called, if we've reached the end of the array, reset to 0, if not, increase by 1
    if (x < images.length-1) {
        x += 1;
    } else {
        x = 0;
    }
}
//When the page loads, display the first review
window.onload = function() {
    const review = document.querySelector('.reviews');
    review.classList.add('change');
    //This interval executes the changeImage function every 5 seconds so that the reviews loop indefinitely
    setInterval(function () {
        changeImage();
    }, 5000);
}
//--END OF REVIEW CHANGING CODE--

//Code specifically for the browse styles button
const customise = document.getElementById('customiseButton');
customise.addEventListener("click", function() {
    document.getElementById("galleryBG").style.display = "flex"; //This reveals the gallery div
    gallery.classList.remove('fadeOut'); //When the browse styles button is clicked, fade in the gallery
    gallery.classList.add('fadeIn');
});

//Audio related variables referenced in the observer code above
var audio = new Audio('audio/halleysComet.wav');//in case you were wondering, this is a snippet from a song I wrote and produced myself and yes that's me attempting to sing, I hope you like it :)
audio.loop = true;
audio.volume = 0;
//It's important to initialise timeout variables to null to ensure they always hold a valid value in case they are referenced before they actually hold a timeout object
T1 = null;
fadeIn = null;
fadeOut = null;
var vol = 0;
var interval = 100;

//Variables relating to the image gallery
const gallery = document.getElementById('gallery');
const previousButton = document.getElementById('previousButton');
const nextButton = document.getElementById('nextButton');
const galleryImages = ['images/style1.png', 'images/style2.png', 'images/style3.png', 'images/style4.png', 'images/style5.png'];
let currentIndex = 0;

//Event listener for when the previous button is clicked
previousButton.addEventListener('click', function() {
    if (currentIndex == 0) {
        currentIndex = galleryImages.length - 1;
    } else {
        currentIndex = currentIndex - 1;
    }
    updateGalleryImage();
});

//Event listener for when the next button is clicked
nextButton.addEventListener('click', function() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateGalleryImage();
});

//This function updates the gallery with the next/previous image based on the currentIndex value, it also handles the fadeIn and fadeOut animation between image changes
function updateGalleryImage() {
    const img = gallery.querySelector('#current-image')
    img.classList.add('fade-out');
    setTimeout(() => {
        img.src = galleryImages[currentIndex];
        img.alt = galleryImages[currentIndex];
        img.classList.remove('fade-out');
    }, 500);
}

//Event listener for when the close button is clicked
closeButton.addEventListener('click', function() {
    gallery.classList.remove('fadeIn'); //When the close button is clicked fade out the gallery
    gallery.classList.add('fadeOut');
    setTimeout(() => {
        document.getElementById("galleryBG").style.display = "none"; //This makes the gallery div invisible after the 1s animation to fade opacity to 0 has played
    },1000);
});