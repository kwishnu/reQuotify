import React from 'react';
const {width, height} = require('Dimensions').get('window');
const CELL_WIDTH = Math.floor(height/1.84)/4;
const CELL_HEIGHT = CELL_WIDTH * .55;
const CELL_PADDING = Math.floor(CELL_WIDTH * .06);
const BORDER_RADIUS = CELL_PADDING * .2;
const TILE_WIDTH = CELL_WIDTH - CELL_PADDING * 2;
const TILE_HEIGHT = CELL_HEIGHT - CELL_PADDING * 2;
//const LETTER_SIZE = Math.floor(TILE_HEIGHT * .7);
const LETTER_SIZE = 0.04 * height;
const LINE_HEIGHT = Math.floor(TILE_HEIGHT * .7);

export const configs = {
    versionCode: 20,
    versionName: '1.2.0',
    appStoreID: 'com.requotify',
    NUM_WIDE: 4,
    CELL_WIDTH: CELL_WIDTH,
    CELL_HEIGHT: CELL_HEIGHT,
    CELL_PADDING: CELL_PADDING,
    BORDER_RADIUS: BORDER_RADIUS,
    TILE_WIDTH: TILE_WIDTH,
    TILE_HEIGHT: TILE_HEIGHT,
    LETTER_SIZE: LETTER_SIZE,
    LINE_HEIGHT: LINE_HEIGHT,
    FB_URL_APP: 'fb://profile/1729363820699544',//1326113070814274
    FB_PAGE_ID: 'fb://page/1729363820699544',//1326113070814274
    FB_URL_BROWSER: 'https://www.facebook.com/ReVersify-1729363820699544/',
    TWITTER_URL_APP: 'twitter://user?id=889153936975740928',
    TWITTER_URL_BROWSER: 'https://twitter.com/reVersify_App'

};

export default configs;