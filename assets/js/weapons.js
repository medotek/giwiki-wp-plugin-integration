import '../scss/weapon.scss';
// import 'animate.css';
const $ = require('jquery');
const Isotope = require('isotope-layout');
jQueryBridget('isotope', Isotope, $);
require('isotope-cells-by-row');


$(window).on('load', function () {
    const weaponsRequest = $.ajax({
        url: 'http://localhost:8000/api/weapons.json',
        type: 'GET',
        beforeSend: function () {
            $('.weapons-filter').after('<div class="ajax-loading">Chargement en cours ...</div>')
        },
        success: (weapons) => {
            $('.ajax-loading').remove();

            weapons.forEach((weapon) => {

                $('#weapons-list').append(
                    '<div class="weapon" id="weapon-' + weapon.id + '" title="' + weapon.name + '">' +
                    '<img src="' + weapon.image + '" alt="' + weapon.name + '">' +
                    '<span class="weapon-data" ' +
                    'data-weapon-id="' + weapon.id + '"' +
                    'data-weapon-name="' + weapon.name + '"' +
                    'data-weapon-image="' + weapon.image + '"' +
                    'data-weapon-rarity="' + weapon.rarity + '"' +
                    'data-weapon-type="' + weapon.weaponType.name + '"' +
                    'data-weapon-description="' + weapon.description + '"' +
                    'data-weapon-passive="' + weapon.passive + '"' +
                    'data-weapon-second-stat-format="' + encodeURIComponent(JSON.stringify(weapon.secondStatFormat)) + '"' +
                    'data-weapon-stats="' + encodeURIComponent(JSON.stringify(weapon.weaponStats)) + '"' +
                    'data-weapon-characters="' + encodeURIComponent(JSON.stringify(weapon.weaponType.characters)) + '"' +
                    '>' +
                    '</span>' +
                    '</div>'
                )
            })

            const $grid = $('#weapons-list').isotope({
                // main isotope options
                itemSelector: '.weapon',
                // set layoutMode
                layoutMode: 'cellsByRow',
                // getSortData: {
                //     constellations: '[data-constellations] parseInt',
                //     level: '[data-level] parseInt',
                //     fetter: '[data-fetter] parseInt',
                // },
            });
        },
        error: (err) => {
            console.log(err)
        }
    })

    weaponsRequest.done(() => {
        $('#weapons-list').each(function (index, item) {
            var $weapon = $(item);
            $weapon.on('click', '.weapon', function () {
                var $weaponId = $(this).children('.weapon-data').data('weapon-id');
                var $weaponName = $(this).children('.weapon-data').data('weapon-name');
                var $weaponImage = $(this).children('.weapon-data').data('weapon-image');
                var $weaponType = $(this).children('.weapon-data').data('weapon-type');
                var $weaponRarity = $(this).children('.weapon-data').data('weapon-rarity');
                var $weaponPassive = $(this).children('.weapon-data').data('weapon-passive');
                var $weaponSecondStat = JSON.parse(decodeURIComponent($(this).children('.weapon-data').data('weapon-second-stat-format')));
                var $weaponStats = JSON.parse(decodeURIComponent($(this).children('.weapon-data').data('weapon-stats')));
                var $weaponSecondStatLabel = $weaponSecondStat.name;
                var $weaponSecondStatFormat = $weaponSecondStat.format;
                var $weaponSecondStatValue = $weaponStats.secondStat;
                var $weaponBaseAtkValue = $weaponStats.baseAtk;
                var $weaponCharacters = JSON.parse(decodeURIComponent($(this).children('.weapon-data').data('weapon-characters')));


                switch ($weaponType) {
                    case 'bow' :
                        $weaponType = 'Arc';
                        break
                    case 'polearm' :
                        $weaponType = 'Arme d\'hast';
                        break
                    case 'sword' :
                        $weaponType = 'Épée à une main';
                        break
                    case 'claymore' :
                        $weaponType = 'Épée à deux mains';
                        break
                    case 'catalyst' :
                        $weaponType = 'Catalyseur';
                        break
                }

                let weaponHeader =
                    '<div class="overlay-close">' +
                    '<button><i class="fas fa-times"></i></button>' +
                    '</div>' +
                    '<div class="overlay-header">' +
                    '<div class="overlay-mobile"></div>' +
                    '<div class="overlay-text">VOIR PLUS</div>' +
                    '</div>' +
                    '<div class="weapon-detail">' +
                    '<img src="' + $weaponImage + '" alt="' + $weaponName + '"/>' +
                    '<div class="weapon-header-info">' +
                    '<p class="weapon-header-title">' + $weaponName + '</p>' +
                    '<p class="weapon-header-rarity"></p>' +
                    '<p class="weapon-header-type">' + $weaponType + '</p>' +
                    '</div>' +
                    '</div>';

                $weapon.find('.active-weapon').removeClass('active-weapon');
                $(this).addClass('active-weapon');
                $('.weapon-overlay')
                    .empty()
                    .addClass('animate__animated animate__bounceInUp')
                    .css({
                        display: 'block',
                    })
                    .html(weaponHeader);



                let $statOption = '';



                var weaponDetail =
                    '<div class="weapon-hover-close"></div>' +
                    '<div class="weapon-full-detail-close">' +
                    '<div class="overlay-mobile"></div>' +
                    '<div class="overlay-text">FERMER</div>' +
                    '</div>' +
                    '<div class="weapon-container">' +
                    '<div class="weapon-main-info">' +
                    '<div class="weapon-img">' +
                    '<img src="' + $weaponImage + '" alt="' + $weaponName + '">' +
                    '</div>' +
                    '<h3>' + $weaponName + '</h3>' +
                    '<div class="rarity-stars"></div>' +
                    '<span class="weapon-type">' + $weaponType + '</span>' +
                    '</div>' +
                    '<div class="weapon-group">' +
                    '<div class="weapon-details">' +
                    '<div class="weapon-stats">' +
                    '<div class="weapon-stats-level">' +
                    '<label>Niveau/Phase</label>' +
                    '<select>' +
                    '<option></option>' +
                    '</select>' +
                    '</div>' +
                    '<div class="weapon-stats-base-atk">' +
                    '<label>Attaque de base</label>' +
                    '<span></span>' +
                    '</div>' +
                    '<div class="weapon-stats-second-stat">' +
                    '<label>' + $weaponSecondStatLabel + '</label>' +
                    '<span class="value"></span><span class="format">' + $weaponSecondStatFormat + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="weapon-passive">' +
                    '<p>' + $weaponPassive + '</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="weapon-characters">' +
                    '<div class="weapon-characters-title">' +
                    '<h3>Personnages - '+$weaponType+'</h3>' +
                    '</div>' +
                    '<div class="weapon-characters-container">' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                $('.weapon-full-detail')
                    .empty()
                    .html(weaponDetail);

                /**
                 * Append character from characters
                 */
                $weaponCharacters.forEach((item, i) => {
                    let character = '<div class="overlay-character '+item.name.toLowerCase().replace(/\s/g, '-')+'"><img src="'+item.imageIcon+'" alt="'+item.name+'"></div>'
                    $('.weapon-characters-container').append(character)
                })

                /**
                 * Append rating stars
                 */
                for(let i = parseInt($weaponRarity); i > 0; i--) {
                    let rarityStars = '<i class="fas fa-star"></i>'
                    $('.rarity-stars, .weapon-header-rarity').append(rarityStars)
                }

            }).on('click', '.active-weapon', function () {
                $(this).removeClass('active-weapon');
                $('.weapon-overlay')
                    .css({display: 'none'})
                if ($('.weapon-full-detail').is('visible')) {
                    $('.weapon-full-detail').slideToggle()
                }
            })
        })
    });

    /**
     * Weapon Overlay - Details (onclick/hover)
     */
    $('.weapon-overlay').on('mouseenter touchstart', '.overlay-header',function () {
        $(this).toggleClass('overlay-hover');

        // if (!$(this).hasClass('overlay-detailed')) {
        $('.weapon-overlay .overlay-mobile').show().animate({
            top: 10,
        }, 100)
        $('.weapon-overlay .overlay-text').show().animate({
            top: -40
        }, 100)
        // }
    }).on('mouseleave','.overlay-header', function () {
        // if (!$(this).hasClass('overlay-detailed')) {
        $('.weapon-overlay .overlay-mobile').animate({
            top: 20,
        }, 100)
        $('.weapon-overlay .overlay-text').hide().animate({
            top: 0
        }, 100)
        // }
    }).on('click', '.overlay-header', function () {
        $('.weapon-full-detail').slideToggle();
        $('.weapon-detail').slideToggle();
        $('.weapon-overlay .overlay-text').animate({
            top: 0,
        })

        // $(this).addClass('overlay-detailed');
    }).on('click', '.overlay-close button', function () {
        $('.weapon-overlay').removeClass('animate__animated animate__bounceInUp').css({
            display: '',
        })
        $('#weapons-list').each(function (index, item) {
            var $weapon = $(item);
            $weapon.find('.active-weapon').removeClass('active-weapon');
        })
    })


    /**
     * Weapon Overlay - full details (onclick/hover)
     */
    $('.weapon-full-detail').on('mouseenter touchstart', '.weapon-hover-close,.overlay-mobile,.overlay-text',function () {
        $(this).toggleClass('overlay-hover');

        $('.weapon-full-detail').children('.weapon-full-detail-close').children('.overlay-mobile').show().animate({
            top: 10,
        }, 100)
        $('.weapon-full-detail').children('.weapon-full-detail-close').children('.overlay-text').show().animate({
            top: -40
        }, 100)
    }).on('mouseleave',' .weapon-hover-close', function () {
        $('.weapon-full-detail').children('.weapon-full-detail-close').children('.overlay-mobile').animate({
            top: '20',
        }, 100).css('top', '')
        $('.weapon-full-detail').children('.weapon-full-detail-close').children('.overlay-text').hide().animate({
            top: 0
        }, 100)
    }).on('click',' .weapon-hover-close', function () {
        $('.weapon-full-detail').slideToggle();
        if(!$('.weapon-overlay').is('visible')) {
            $('.weapon-overlay').removeClass('overlay-detailed');
            if(!$('.weapon-detail').is('visible')) {
                $('.weapon-detail').slideToggle();
            }
        }
    })
})

