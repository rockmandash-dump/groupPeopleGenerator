$( document ).ready(function() {

    Number.isInteger = Number.isInteger || function(value) {
        return typeof value === 'number' &&
            isFinite(value) &&
            Math.floor(value) === value;
    };



    var $lists = [],
        initText = '法文\n董芝安\n大雄 (陸生)\n靜香',
        currentIndex = 0

    var newCodeMirror = CodeMirror( $('.app-panel-codemirror')[0], {
        lineNumbers: true,
        lineWrapping: true
    })
    newCodeMirror.setSize("100%", "100%")
    newCodeMirror.getDoc().setValue( initText )

    // ============================================================
    // function
    // ============================================================

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }


    function generateNewGroup() {

        var $newList = $( '<li><span><span class="name">法文</span>總共<span class="total">3</span>人<span class="china">1</span>人陸生</span></li>' )
        $( '.app-panel-grouplist ul' ).append( $newList )
        $lists.push({
            element: $newList,
            value: initText
        })

        $newList.on('click', function() {

            saveList()

            $('.app-panel-grouplist ul li').eq( currentIndex ).removeClass('on')
            currentIndex = $('.app-panel-grouplist ul li').index( this )
            $('.app-panel-grouplist ul li').eq( currentIndex ).addClass('on')

            newCodeMirror.getDoc().setValue( $lists[currentIndex].value )
        })

    }

    function saveList() {
        $lists[currentIndex].value = newCodeMirror.getValue()
        refresh()
    }
    function refresh() {
        var text = newCodeMirror.getValue().split('\n'),
            category = text[0],
            totalPeople = text.length - 1

        var china = 0
        $.each( text, function( i, val ) {
            if ( text[i].indexOf('(陸生)') !== -1 ) {
                china += 1
            }
        })

        $lists[currentIndex].element.find('.name').text(category)
        $lists[currentIndex].element.find('.total').text(totalPeople)
        $lists[currentIndex].element.find('.china').text(china)
    }

    function generateList() {

        $('.originalListContainer').empty()

        for(var i = 0; i < $lists.length; i += 1) {
            var $newList = $('<ul></ul>')
            var text = $lists[i].value.split('\n')
            for(var j = 0; j < text.length; j += 1) {
                var $newElement = $('<li>' + text[j] + '</li>')
                $newList.append( $newElement )
            }
            $('.originalListContainer').append( $newList )
        }


        var result = []
        var count = 0
        var totalGroup = 1
        var inputValue = parseInt( $('.groupLength').eq(0).val(), 10)
        if ( Number.isInteger(inputValue) ) {
            totalGroup = inputValue
        }

        function getCurrentCount() {

            var currentCount = count
            if ( count === ( totalGroup - 1 ) ) {
                count = 0
            } else {
                count += 1
            }
            return currentCount
        }

        for( var i = 0; i < totalGroup; i += 1 ) {

            var leadingNumber = i + 1
            var leadingText = '第' + leadingNumber + '組'

            result.push( [leadingText] )

        }

        for( var j = 0; j < $lists.length; j += 1 ) {

            var text = $lists[j].value.split('\n')
            var category = text.shift()

            var length = text.length
            var shuffledArray = shuffle( text )

            for( var k = 0; k < length; k += 1 ) {
                var item = shuffledArray[k]
                result[ getCurrentCount() ].push( item )
            }

        }









        $('.shuffleListContainer').empty()

        for(var i = 0; i < result.length; i += 1) {
            var $newList = $('<ul></ul>')
            var text = result[i].join().split(',')
            for(var j = 0; j < text.length; j += 1) {
                var $newElement = $('<li>' + text[j] + '</li>')
                $newList.append( $newElement )
            }
            $('.shuffleListContainer').append( $newList )
        }


        $('.shuffleListContainer ul').sortable({
            connectWith: '.shuffleListContainer ul',
            items: 'li:not(:first-child)'
        }).disableSelection()
    }

    // ============================================================
    // event listener
    // ============================================================

    $('.app-panel-grouplist .add').on('click', function() {
        generateNewGroup()
    })


    $('.app-panel-codemirror .saveList').on('click', function() {
        saveList()
        refresh()
    })

    $('.generateList').on('click', function () {
        generateList()
    })


    // ============================================================
    // main
    // ============================================================

    // 一開始先增加一個
    generateNewGroup()
    $('.app-panel-grouplist ul li').eq( currentIndex ).click()


})