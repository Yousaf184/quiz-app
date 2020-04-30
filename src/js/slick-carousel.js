import $ from 'jquery';
import slick from 'slick-carousel';

export function createSlickSlider({targetElementClass, options}) {
    $(document).ready(function() {
        $(`.${targetElementClass}`).slick(options);
    });
}

export function hideSlickSlider(targetElementClass) {
    $(`.${targetElementClass}`).slick('unslick');
}

export function slickNextImage(targetElementClass) {
    $(`.${targetElementClass}`).slick('slickNext');
}
