// FIX BECAUSE FONTS AREN'T LOADING IN FIRST PAGE LOAD

const isFontLoaded = (name, weight) => {
  return document.fonts.check(`1em ${name}`, weight);
};

const loadFont = (name, weight, url) => {
  if (!isFontLoaded(name, weight)) {
    console.log("font already loaded");
    return;
  }

  const font = new FontFace(name, `url(${url})`, {
    weight: weight,
    display: "optional",
  });
  font
    .load()
    .then(function (loadedFont) {
      document.fonts.add(loadedFont);
      console.log(`Font ${name} with weight ${weight} loaded`);
    })
    .catch(function (error) {
      console.error(
        `Failed to load font ${name} with weight ${weight}:`,
        error
      );
    });
};

const loadAllFonts = () => {
  loadFont("Netflix Sans", "100", "assets/fonts/NetflixSans_W_Th.woff2");
  loadFont("Netflix Sans", "300", "assets/fonts/NetflixSans_W_Lt.woff2");
  loadFont("Netflix Sans", "400", "assets/fonts/NetflixSans_W_Rg.woff2");
  loadFont("Netflix Sans", "700", "assets/fonts/NetflixSans_W_Md.woff2");
  loadFont("Netflix Sans", "700", "assets/fonts/NetflixSans_W_Bd.woff2");
};

export { loadAllFonts };
