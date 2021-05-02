//Контроллер "О Нас"
function AboutUsController($scope) {
    var NAMES_LIST = ['andre', 'alex', 'ivan'];
    var CHARACTERS_MESSAGES = {
        'ru': {
            'andre': {'name': 'Сэр Андре', 'profession': 'Технолог'},
            'alex': {'name': 'Сэр Алекс', 'profession': 'Рыцарь смерти'},
            'ivan': {'name': 'Сэр Джон', 'profession': 'Архимаг'}
        },
        'en': {
            'andre': {'name': 'Sir Andre', 'profession': 'Technologist'},
            'alex': {'name': 'Sir Alex', 'profession': 'Death knight'},
            'ivan': {'name': 'Sir John', 'profession': 'Archmage'}
        }
    };

    AppController.setSelectedMenuElement(1);
    var pageTitle = $scope['messages']['titles']['about_us'];
    AppController.setPageTitle(pageTitle);

    AppController.initShareWidgets();
    initCharactersList();

    var dataUrl = '/data/about-us-' + $scope.lang + '.json?v=' + window['cache_ver'];
    Ajax.getData(dataUrl, onPageDataLoaded);

    var self = this;
    $('#about-us-characters').on('click', '.leveling-button', function() {
        onLevelingButton.call(self, this);
    });

    function initCharactersList() {
        $scope['all_experience'] = 1;
        $scope.$watch('lang', function () {
            $scope['characters_list'] = [];
            for (var i = 0; i < NAMES_LIST.length; ++i) {
                var id = NAMES_LIST[i];
                $scope['characters_list'].push({
                    'id': id,
                    'name': CHARACTERS_MESSAGES[$scope.lang][id]['name'],
                    'profession': CHARACTERS_MESSAGES[$scope.lang][id]['profession'],
                    'level': 0,
                    'experience': 0,
                    'max_experience': 1,
                    'exp_marker_style': {'width': '50%'},
                    'exp_rating_style': {'width': '35%'}
                });
            }
        });

        var alreadyVote = $.cookie('already_vote');
        $scope.can_vote = !(alreadyVote);
    }

    function onPageDataLoaded(data) {
        var pageData = data['page_data'];

        if (pageData['title'])
            AppController.setPageTitle(pageData['title']);
        AppController.setMetaDescription(pageData['description']);

        $('#about-us-text').html(pageData['text']);

        var gameData = data['game'];
        handleGameData(gameData);

        AppController.documentStatus('ready');
    }

    function handleGameData(gameData) {
        var allExperience = 0;
        var charactersList = $scope['characters_list'];
        var globalMaxExp = 0;
        var champion = NAMES_LIST[0];

        var id, exp, userMaxExp, userPrevExp, level, width;
        for (var i = 0; i < charactersList.length; ++i) {
            id = charactersList[i]['id'];
            exp = parseInt(gameData[id]['exp']);
            userMaxExp = parseInt(gameData[id]['max_exp']);
            userPrevExp = parseInt(gameData[id]['prev_max_exp']);
            level = parseInt(gameData[id]['level']);

            allExperience += exp;
            charactersList[i]['experience'] = exp;
            charactersList[i]['max_experience'] = userMaxExp;
            charactersList[i]['level'] = level;

            width = (exp - userPrevExp)*100/userMaxExp;
            charactersList[i]['exp_marker_style'] = {'width': width + '%'};

            if (exp > globalMaxExp) {
                globalMaxExp = exp;
                champion = id;
            }
        }

        for (i = 0; i < charactersList.length; ++i) {
            id = charactersList[i]['id'];
            width = charactersList[i]['experience']*35/allExperience;
            charactersList[i]['exp_rating_style'] = {'width': width + '%'};
        }

        $('.about-us-character').removeClass('champion');
        $('#'+champion).addClass('champion');

        $scope['all_experience'] = allExperience;
        $scope['characters_list'] = charactersList;

        AppController.refresh();
    }

    function onLevelingButton(elem) {
        $scope.can_vote = false;
        $.cookie('already_vote', 1, {'path': '/', 'expires': 1});

        var id = $(elem).attr('data-character');
        if (!id)
            return;

        var curLevel = 0;
        var charsList = $scope.characters_list;
        for (var i=0; i<charsList.length; ++i) {
            if (charsList[i]['id'] == id) {
                curLevel = charsList[i]['level'];
                break;
            }
        }

        var data = {'id': id};
        Ajax.postData(dataUrl, data, function(data) {
            handleGameData(data['game']);
            if (data['game'][id]['level'] > curLevel) {
                $('#{0} .level-up'.replace('{0}', id)).show();
                setTimeout(function() {
                    $('#{0} .level-up'.replace('{0}', id)).hide();
                }, 2000);
            }
        });
    }
}

AboutUsController.$inject = ['$scope'];
