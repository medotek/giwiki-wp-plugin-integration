
const $ = require('jquery');
const Isotope = require('isotope-layout');
jQueryBridget('isotope', Isotope, $);
require('isotope-cells-by-row');

const $weaponPhase = [
    {
        "text"  : "1",
        "value" : 1
    },
    {
        "text"  : "20",
        "value" : 20
    },
    {
        "text"  : "20+",
        "value" : 21
    },
    {
        "text"  : "40",
        "value" : 40
    },
    {
        "text"  : "40+",
        "value" : 41
    },
    {
        "text"  : "50",
        "value" : 50
    },    {
        "text"  : "50+",
        "value" : 51
    },
    {
        "text"  : "60",
        "value" : 60
    },
    {
        "text"  : "60+",
        "value" : 61
    },
    {
        "text"  : "70",
        "value" : 70
    },
    {
        "text"  : "70+",
        "value" : 71
    },
    {
        "text"  : "80",
        "value" : 80
    },
    {
        "text"  : "80+",
        "value" : 81
    },
    {
        "text"  : "90",
        "value" : 90
    },
];



var filterFns = {
    // show if number is greater than 50
    numberGreaterThan50: function () {
        var number = $(this).has('.number').text();
        return parseInt(number, 10) > 50;
    },
    // show if name ends with -ium
    ium: function () {
        var name = $(this).has('.name').text();
        return name.match(/ium$/);
    }
};



$(window).on('load', function () {


    const weaponsRequest = $.ajax({
        url: 'https://seeliedb.guda.club/api/weapons.json',
        type: 'GET',
        beforeSend: function () {
            $('.weapons-filter').after('<div class="ajax-loading">Chargement en cours ...</div>')
        },
        success: (weapons) => {
            $('.ajax-loading').remove();

            weapons.forEach((weapon) => {

                $('#weapons-list').append(
                    '<div class="weapon '+weapon.weaponType.name+' rarity-'+weapon.rarity+'" id="weapon-' + weapon.id + '" title="' + weapon.name + '">' +
                    '<img src="' + weapon.image + '" alt="' + weapon.name + '">' +
                    '<div class="weapon-search name">' + weapon.name + '</div>' +
                    '<span class="weapon-data" ' +
                    'data-weapon-id="' + weapon.id + '"' +
                    'data-weapon-name="' + weapon.name + '"' +
                    'data-weapon-image="' + encodeURIComponent(JSON.stringify(weapon.image)) + '"' +
                    'data-weapon-rarity="' + weapon.rarity + '"' +
                    'data-weapon-type="' + weapon.weaponType.name + '"' +
                    'data-weapon-description="' + encodeURIComponent(JSON.stringify(weapon.description)) + '"' +
                    'data-weapon-passive="' + encodeURIComponent(JSON.stringify(weapon.passive)) + '"' +
                    'data-weapon-second-stat-format="' + encodeURIComponent(JSON.stringify(weapon.secondStatFormat)) + '"' +
                    'data-weapon-stats="' + encodeURIComponent(JSON.stringify(weapon.weaponStats)) + '"' +
                    'data-weapon-characters="' + encodeURIComponent(JSON.stringify(weapon.weaponType.characters)) + '"' +
                    '>' +
                    '</span>' +
                    '</div>'
                )

            })

            // quick search regex
            var qsRegex;

            const $grid = $('#weapons-list').isotope({
                // main isotope options
                itemSelector: '.weapon',
                // set layoutMode
                layoutMode: 'cellsByRow',
                filter: function(el) {
                    return qsRegex ? $(el).children('.weapon-search').text().match( qsRegex ) : true;
                }
            });

            // use value of search field to filter
            var $quicksearch = $('.quicksearch').keyup( debounce( function() {
                qsRegex = new RegExp( $quicksearch.val(), 'gi' );
                $grid.isotope();
            }) );


            // debounce so filtering doesn't happen every millisecond
            function debounce( fn, threshold ) {
                var timeout;
                threshold = threshold || 100;
                return function debounced() {
                    clearTimeout( timeout );
                    var args = arguments;
                    var _this = this;
                    function delayed() {
                        fn.apply( _this, args );
                    }
                    timeout = setTimeout( delayed, threshold );
                };
            }


            $('.type-filter, .rarity-filter').on('click', 'button', function () {
                var filterValue = $(this).attr('data-filter');
                // use filterFn if matches value
                filterValue = filterFns[filterValue] || filterValue;
                $grid.isotope({
                    filter: filterValue,
                });
            }).each(function (i, buttonGroup) {
                var $buttonGroup = $(buttonGroup);
                $buttonGroup.on('click', 'button', function () {
                    $buttonGroup.find('.active-filter').removeClass('active-filter');
                    $(this).addClass('active-filter');
                });
            });

        },
        error: (err) => {
            console.log(err)
        }
    })

    /**
     * Once Ajax request is done
     * Execute the following code
     */
    weaponsRequest.done(() => {
        $('#weapons-list').each(function (index, item) {
            var $weapon = $(item);
            $weapon.on('click', '.weapon', function () {
                var $weaponId = $(this).children('.weapon-data').data('weapon-id');
                var $weaponName = $(this).children('.weapon-data').data('weapon-name');
                var $weaponImage = JSON.parse(decodeURIComponent($(this).children('.weapon-data').data('weapon-image')));
                var $weaponType = $(this).children('.weapon-data').data('weapon-type');
                var $weaponRarity = $(this).children('.weapon-data').data('weapon-rarity');
                var $weaponPassive = JSON.parse(decodeURIComponent($(this).children('.weapon-data').data('weapon-passive')));
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
                    '<div class="description">' +
                    '<h3>' + $weaponName + '</h3>' +
                    '<div class="rarity-stars"></div>' +
                    '<span class="weapon-type">' + $weaponType + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="weapon-group">' +
                    '<div class="weapon-details">' +
                    '<div class="mobile-description">' +
                    '<h3>' + $weaponName + '</h3>' +
                    '<div class="rarity-stars"></div>' +
                    '<span class="weapon-type">' + $weaponType + '</span>' +
                    '</div>' +
                    '<div class="weapon-stats">' +
                    '<label class="weapon-stats-level">Niveau/Phase</label>' +
                    '<select class="weapon-stats-level">' +
                    '</select>' +
                    '<label class="weapon-stats-base-atk">Attaque de base</label>' +
                    '<span class="weapon-stats-base-atk"></span>' +
                    '<label class="weapon-stats-second-stat">' + $weaponSecondStatLabel + '</label>' +
                    '<span class="weapon-stats-second-stat-value">' +
                    '<span class="value">' +
                    '</span>' +
                    '<span class="weapon-stats-second-stat-format">' +
                    $weaponSecondStatFormat +
                    '</span>' +
                    '</span>' +
                    '</div>' +
                    '<div class="weapon-passive">' +
                    '<div class="weapon-passive-title">' +
                    '<h3>Passif</h3>' +
                    '</div>' +
                    '<div class="weapon-passive-container">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="weapon-characters">' +
                    '<div class="weapon-characters-title">' +
                    '<h3>Personnages - '+$weaponType+'</h3>' +
                    '</div>' +
                    '<div class="weapon-characters-container">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="mobile-content">' +
                    '<div class="mobile-passive">' +
                    '<div class="weapon-passive-title">' +
                    '<h3>Passif</h3>' +
                    '</div>' +
                    '<div class="weapon-passive-container">' +
                    '</div>' +
                    '</div>' +
                    '<div class="mobile-characters">' +
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
                 * Append passive on weapon
                 */
                $('.weapon-passive-container').empty().html($weaponPassive)

                /**
                 * Append character from characters
                 */
                $weaponCharacters.forEach((item, i) => {
                    let character = '<div class="overlay-character '+item.name.toLowerCase().replace(/\s/g, '-')+'"><img src="'+item.imageIcon+'" alt="'+item.name+'"></div>'
                    $('.weapon-characters-container, .mobile-characters.weapon-characters-container').append(character)
                })

                /**
                 * Append options in .weapon-stats-level
                 */
                $weaponPhase.forEach((item, i) => {
                    $('select.weapon-stats-level').append($('<option>', {
                        value: item.value,
                        text : item.text
                    }));
                })

                /**
                 * Init default values
                 * @type {*|jQuery}
                 */
                let $weaponStatkey = $('select.weapon-stats-level').val();
                $weaponBaseAtkValue.forEach((item, i) => {
                    if (item.name === $weaponStatkey) {
                        $('span.weapon-stats-base-atk').empty().append(item.value)
                    }
                })
                $weaponSecondStatValue.forEach((item, i) => {
                    if (item.name === $weaponStatkey) {
                        $('.weapon-stats-second-stat-value .value').empty().append(item.value)
                    }
                })

                /**
                 * On change get and set a value (baseAtk, SecondStat)
                 */
                $('select.weapon-stats-level').on('change', function() {
                    let $weaponStatkey = $(this).val();
                    $weaponBaseAtkValue.forEach((item, i) => {
                        if (item.name === $weaponStatkey) {
                            $('span.weapon-stats-base-atk').empty().append(item.value)
                        }
                    })
                    $weaponSecondStatValue.forEach((item, i) => {
                        if (item.name === $weaponStatkey) {
                            $('.weapon-stats-second-stat-value .value').empty().append(item.value)
                        }
                    })
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
                $('.weapon-full-detail').css({display: 'none'})
            })
        })

        /**
         * Still ajax done
         */
        if ($(window).innerWidth < 992 && $(window).innerWidth > 450 ) {
            var offset = $('.weapon-overlay').offset();
            var bottomPos = $(window).scrollTop() + $(window).height()
            var top = offset.top;
            var overlayBottomPos = $(window).height() - top - $('.weapon-overlay').height();
            overlayBottomPos = overlayBottomPos - offset.top;
            $('.weapon-overlay, .weapon-full-detail').css({bottom: (-(bottomPos) + overlayBottomPos)});
        }
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
                $('.weapon-detail').show();
            }
        }
    })


})

