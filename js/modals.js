/**
 * Created by tom on 26/11/2015.
 */

function showWhyThisModal() {
    bootbox.alert({
        title: "Why this?",
        message: '<p>It started when I became sick of visiting ugly, complicated and ad-heavy websites or having to use mobile apps for such a simple need : ' +
        'quickly checking the traffic condition in my area.</p>' +
        '<p>I wanted a minimalistic, flat and yet light view where I can check for traffic jams ' +
        'quickly even on my mobile without waiting for very long or being bothered clicking around here and there. </p>' +
        '<p>Here is <span class="brand normal">traffc</span>, my new road companion and maybe yours too. Enjoy ;)</p>',
        buttons: {
            ok: {
                label: "close",
                className: "btn-default"
            }
        }
    });
}

function showAboutModal() {
    bootbox.alert({
        title: "About",
        message: '<p>Made [quickly] by Hatem Zidi (<a href="http://twitter.com/tom_z" target="_blank">@tom_z</a>)</p>' +
        '<p>Feel free to contribute on <a href="https://github.com/hatemzidi/traffc" target="_blank">Github</a>.</p>' +
        '<p>Visit <a href="http://whatis.traffc.info" target="_blank">http://whatis.traffc.info</a> for more info.</p>' +
        '<p>&copy; 2015 &hyphen; <span class="version">v 0.8 (__VERSION__)</span></p>',
        buttons: {
            ok: {
                label: "close",
                className: "btn-default"
            }
        }
    });
}