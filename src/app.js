/**
 * YouVersion Verse of the Day app for Pebble
 */

var UI = require('ui');
//var Vector2 = require('vector2');
var ajax = require('ajax');

var loading = new UI.Card({
  title: 'YouVersion Verse of the Day',
  body: 'Loading...'
});
loading.show();

var usfm_to_human = {'GEN': 'Genesis', 'EXO': 'Exodus', 'LEV': 'Leviticus',
              'NUM': 'Numbers', 'DEU': 'Deuteronomy', 'JOS': 'Joshua',
              'JDG': 'Judges', 'RUT': 'Ruth', '1SA': '1 Samuel',
              '2SA': '2 Samuel', '1KI': '1 Kings', '2KI': '2 Kings',
              '1CH': '1 Chronicles', '2CH': '2 Chronicles', 'EZR': 'Ezra',
              'NEH': 'Nehemiah', 'EST': 'Esther', 'JOB': 'Job', 'PSA': 'Psalm',
              'PRO': 'Proverbs', 'ECC': 'Ecclesiastes', 'SNG': 'Song of Songs',
              'ISA': 'Isaiah', 'JER': 'Jeremiah', 'LAM': 'Lamentations',
              'EZK': 'Ezekiel', 'DAN': 'Daniel', 'HOS': 'Hosea', 'JOL': 'Joel',
              'AMO': 'Amos', 'OBA': 'Obadiah', 'JON': 'Jonah', 'MIC': 'Micah',
              'NAM': 'Nahum', 'HAB': 'Habakkuk', 'ZEP': 'Zephaniah',
              'HAG': 'Haggai', 'ZEC': 'Zechariah', 'MAL': 'Malachi',
              'MAT': 'Matthew', 'MRK': 'Mark', 'LUK': 'Luke', 'JHN': 'John',
              'ACT': 'Acts', 'ROM': 'Romans', '1CO': '1 Corinthians',
              '2CO': '2 Corinthians', 'GAL': 'Galatians', 'EPH': 'Ephesians',
              'PHP': 'Philippians', 'COL': 'Colossians',
              '1TH': '1 Thessalonians', '2TH': '2 Thessalonians',
              '1TI': '1 Timothy', '2TI': '2 Timothy', 'TIT': 'Titus',
              'PHM': 'Philemon', 'HEB': 'Hebrews', 'JAS': 'James',
              '1PE': '1 Peter', '2PE': '2 Peter', '1JN': '1 John',
              '2JN': '2 John', '3JN': '3 John', 'JUD': 'Jude',
              'REV': 'Revelation', 'TOB': 'Tobit', 'JDT': 'Judith',
              'ESG': 'Esther Greek', 'WIS': 'Wisdom of Solomon',
              'SIR': 'Sirach', 'BAR': 'Baruch', 'LJE': 'Letter of Jeremiah',
              'S3Y': 'Song of the 3 Young Men', 'SUS': 'Susanna',
              'BEL': 'Bel and the Dragon', '1MA': '1 Maccabees',
              '2MA': '2 Maccabees', '3MA': '3 Maccabees',
              '4MA': '4 Maccabees', '1ES': '1 Esdras (Greek)',
              '2ES': '2 Esdras (Latin)', 'MAN': 'Prayer of Manasseh',
              'PS2': 'Psalm 151', 'ODA': 'Odae/Odes',
              'PSS': 'Psalms of Solomon', 'EZA': 'Ezra Apocalypse',
              '5EZ': '5 Ezra', '6EZ': '6 Ezra', 'DAG': 'Daniel Greek',
              'PS3': 'Psalms 152-155', '2BA': '2 Baruch (Apocalypse)',
              'LBA': 'Letter of Baruch', 'JUB': 'Jubilees', 'ENO': 'Enoch',
              '1MQ': '1 Meqabyan/Mekabis', '2MQ': '2 Meqabyan/Mekabis',
              '3MQ': '3 Meqabyan/Mekabis', 'REP': 'Reproof', '4BA': '4 Baruch',
              'LAO': 'Letter to the Laodiceans', 'LKA': 'Luke-Acts'};
//console.log('TESTING USFM TO HUMAN');
//console.log(usfm_to_human.GEN);


// Make the request
ajax(
    {
        url: 'https://bible.youversionapi.com/3.1/verse_of_the_day.json',
        type: 'json',
        headers: {
            'X-YouVersion-Client': 'youversion',
            'X-YouVersion-App-Platform': 'web',
            'X-YouVersion-App-Version': '1'
        },
        cache: true
    },
    
    function(data) {
        console.log('Successfully fetched votd data!');
        
        var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        var now = new Date();
        var mn = now.getMonth();
        var dn = now.getDate();
        var dayOfYear = dayCount[mn] + dn;
        var year = now.getFullYear();
        var isLeapYear;
        if (year % 4 !== 0) {
            isLeapYear = false;
        } else {
            isLeapYear = ((year % 100) !== 0 || (year % 400) === 0);
        }
        if (mn > 2 && isLeapYear) {
            dayOfYear++;
        }
        
        // Can go back to previous days here to test multiple verses if needed
        //dayOfYear = dayOfYear - 12;
        
        var todays_votd = data.response.data[dayOfYear].references[0];
        console.log(todays_votd);
        
        /*
         * If its a plus separated verse range, and retrieve each verse
         */
        var usfms = todays_votd.split('+');
        var todays_human = [];
        var verse_text = [];
        
        for (var i = 0; i < usfms.length; i++) {
            var parts = usfms[i].split('.');
            if (todays_human.length === 0) {
                console.log('TESTING USFM TO HUMAN');
                console.log(usfm_to_human[parts[0]]);
                todays_human.push(usfm_to_human[parts[0]] + ' ' + parts[1] + ':' + parts[2]);
            } else {
                todays_human.push(parts[2]);
            }
            
            ajax(
                {
                    url: 'https://bible.youversionapi.com/3.1/verse.json?id=111&reference=' + usfms[i],
                    type: 'json',
                    headers: {
                        'Origin': 'windows-8',
                        'X-YouVersion-Client': 'youversion',
                        'X-YouVersion-App-Platform': 'web',
                        'X-YouVersion-App-Version': '1'
                    },
                    cache: true
                },
    
                function(data) {
                    console.log('Successfully fetched verse data!');
                    verse_text.push(data.response.data.content);
                    console.log('inside success verse_text is ' + verse_text);
                    
                    var main = new UI.Card({
                        title: todays_human.join('-'),
                        body: verse_text.join(' '),
                        scrollable: true
                    });
                    main.show();

                },
                
                function(error) {
                    console.log('Failed fetching verse data: ' + error.code);
                    console.log('Failed fetching verse data: ' + error.response.data.errors[0].key);
                    var error2 = new UI.Card({
                        title: 'Failed loading Verse of the Day.',
                        body: 'Please check your internet connection and try again later.'
                    });
                    error2.show();
                }
            );
            console.log('inside for loop verse text is ' + verse_text);
        }
    },
    
    function(error) {
        console.log('Failed fetching votd data: ' + error);
      
        var error3 = new UI.Card({
            title: 'Failed loading Verse of the Day.',
            body: 'Please check your internet connection and try again later.'
        });
        error3.show();
    }
);

/*
var Vector2 = require('vector2');

var main = new UI.Card({
  title: 'Pebble.js',
  icon: 'images/menu_icon.png',
  subtitle: 'Hello World!',
  body: 'Press any button.',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

main.show();

main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

main.on('click', 'select', function(e) {
  var wind = new UI.Window({
    fullscreen: true,
  });
  var textfield = new UI.Text({
    position: new Vector2(0, 65),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
*/