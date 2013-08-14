var app_conf = {
    baseUrl: 'js/lib',
    paths: { data: '../data', jquery: 'jquery-1.10.2.min', sfapp: '../../sfapp' },
    shim: { "underscore-min": { exports: '_' }, "json2": {exports:"JSON"}, "knockout-2.3.0": { deps: ["json2"], exports: "ko"},
            "sfapp/js/bootstrap.min": ["jquery"], "sfapp/js/sfapp": ["jquery",  "sfapp/js/bootstrap.min"] }
};
require.config(app_conf);

require(['jquery', 'json2', 'knockout-2.3.0', 'underscore-min', 'data/typeaheads',
        'modernizr.min', 'sfapp/js/bootstrap.min', 'sfapp/js/sfapp'],
function($, JSON, ko, _, typeaheads) {
    var committee_names, candidate_names, cachedExampleJSON;

function trimForExport (key, value) {
    // if (value === null) return undefined;
    switch (key) {
        case "advertisementSubjectOptions":
        case "doesReferToCandidate":
        case "principals":
        case "isByCandidateOrCommittee":
            return undefined;
        case "purchaseApproved":
        case "refersToCandidate":
        case "byCandidateOrCommittee":
            if (value === "yes") {
                return true;
            }
            else {
                return false;
            }
            break;
        default:
            break;
    }
    if (value === "") {
        return undefined;
    }
    else {
        return value;
    }
}

function evaluateYesNo (value) {
    if (value === "yes") {
        return true;
    }
    else if (value === "no") {
        return false;
    }
    return undefined;
}

// http://politicaladsleuth.com/political-files/d048f5d0-ee8e-4e29-a49b-1ea97487dd4c/
    var exampleData = {
        "contractNumber": "8533",
        "stationCallsign": "WABC-TV",
        "purchaseApproved": "yes",
        "contractAmount": 8900.00,
        "byCandidateOrCommittee": "yes",
        "sponsorCandidate": "PALLONE, FRANK JR",
        "sponsorCommittee": "PALLONE FOR SENATE",
        "refersToCandidate": "yes",
        "subjectName": "PALLONE, FRANK JR",
        "subjectOfficeSought": "U.S. Senate",
        "sponsoredBy": "PALLONE FOR SENATE",
        "sponsorCommitteeTreasurer": "Nichols, Peter D.",
        "purchases": [
            {
                "startDate": "8/12/13",
                "endDate": "8/12/13",
                "beginTime": "6:15am",
                "endTime": "7:00am",
                "adRate": 1400.00,
                "numberSpots": 1,
                "timeClass": null
            },
            {
                "startDate": "8/12/13",
                "endDate": "8/12/13",
                "beginTime": "7:00am",
                "endTime": "9:00am",
                "adRate": 2000.00,
                "numberSpots": 2,
                "timeClass": null
            },
            {
                "startDate": "8/12/13",
                "endDate": "8/12/13",
                "beginTime": "11:15pm",
                "endTime": "11:35pm",
                "adRate": 3500.00,
                "numberSpots": 1,
                "timeClass": null
            }
        ]
    };

    var PurchaseModel = function()
    {
        var self = this;
        self.startDate = ko.observable(null);
        self.endDate = ko.observable(null);
        self.beginTime = ko.observable(null);
        self.endTime = ko.observable(null);
        self.adRate = ko.observable(null);
        self.numberSpots = ko.observable();
        self.timeClass = ko.observable();
    };

    function FormViewModel() {
        var self = this;
        self.stationCallsign = ko.observable();
        self.purchaseApproved = ko.observable();
        self.contractAmount = ko.observable();
        self.byCandidateOrCommittee = ko.observable();
        self.isByCandidateOrCommittee = ko.computed(function() {
            var val =  evaluateYesNo(self.byCandidateOrCommittee());
            if (val === undefined) {
                return false;
            }
            return val;
        });
        self.sponsorCandidate = ko.observable();
        self.sponsorCommittee = ko.observable();
        self.sponsorCommitteeTreasurer = ko.observable();
        self.sponsorCommitteeFecId = ko.observable();
        self.sponsoredBy = ko.observable();
        self.sponsorContactAddress = ko.observable();
        self.sponsorContactPhone = ko.observable();
        self.advertisementSubjectOptions = ko.observableArray(['Candidate', 'Issue', 'Election']);
        self.advertisementSubject = ko.observable();
        self.refersToCandidate = ko.observable();
        self.doesReferToCandidate = ko.computed(function() {
            return evaluateYesNo(self.refersToCandidate());
        });
        self.subjectFecId = ko.observable();
        self.subjectName = ko.observable();
        self.subjectOfficeSought = ko.observable();
        self.sponsoredBy = ko.observable();
        self.sponsorFecId = ko.observable();
        self.principals = ko.observable();
        self.principalsList = ko.computed(function() {
            var raw_input = self.principals();
            if (raw_input === undefined) {
                return undefined;
            }
            var list = raw_input.split('\n');
            return list;
        });
        self.purchases = ko.observableArray([new PurchaseModel()]);
        self.addPurchase = function () {
            self.purchases.push(new PurchaseModel());
        };
        self.exampleJSON = function() {
            if (cachedExampleJSON === undefined) {
                cachedExampleJSON = JSON.stringify(exampleData, trimForExport, 4);
            }
            return cachedExampleJSON;
        };
        self.loadExampleData = function() {
            self.stationCallsign(exampleData.stationCallsign);
            self.purchaseApproved(exampleData.purchaseApproved);
            self.contractAmount(exampleData.contractAmount);
            self.byCandidateOrCommittee(exampleData.byCandidateOrCommittee);
            self.sponsorCandidate(exampleData.sponsorCandidate);
            self.sponsorCommittee(exampleData.sponsorCommittee);
            self.sponsorCommitteeTreasurer(exampleData.sponsorCommitteeTreasurer);
            self.sponsorCommitteeFecId(exampleData.sponsorCommitteeFecId);
            self.sponsoredBy(exampleData.sponsoredBy);
            self.sponsorContactAddress(exampleData.sponsorContactAddress);
            self.sponsorContactPhone(exampleData.sponsorContactPhone);
            self.advertisementSubject(exampleData.advertisementSubject);
            self.refersToCandidate(exampleData.refersToCandidate);
            self.subjectFecId(exampleData.subjectFecId);
            self.subjectName(exampleData.subjectName);
            self.subjectOfficeSought(exampleData.subjectOfficeSought);
            self.sponsoredBy(exampleData.sponsoredBy);
            self.purchases(exampleData.purchases);
        };
        self.resetForm = function() {
            self.stationCallsign(null);
            self.purchaseApproved(true);
            self.contractAmount(null);
            self.byCandidateOrCommittee(false);
            self.sponsoredBy(null);
            self.sponsorContactAddress(null);
            self.sponsorContactPhone(null);
            self.sponsorCandidate(null);
            self.sponsorCommittee(null);
            self.sponsorCommitteeFecId(null);
            self.advertisementSubject(null);
            self.refersToCandidate(null);
            self.subjectFecId(null);
            self.subjectName(null);
            self.subjectOfficeSought(null);
            self.sponsoredBy(null);
            self.sponsorCommitteeTreasurer(null);
            self.purchases([new PurchaseModel()]);

            if (!Modernizr.input.placeholder) {
                var formpl = '#fcc_form [placeholder]';
                $(formpl).each(function() {
                    $(self).val( $(self).attr('placeholder') );
                });
            }
        };
        self.outputJSON = function() {
            return ko.toJSON(self, trimForExport, 4);
        };
        self.submitForm = function(formElement) {
            $(formElement).find('input,textarea,select').filter(':disabled').each(function(index, el) {
                var elName = $(el).attr('name');
                self[elName](undefined);
            });
            $('#form-submit-modal').modal();
        };
        self.matchCommitteeToFecId = function() {
            try {
                var fecId = typeaheads.committees[self.sponsoredBy()];
                if (fecId !== null) {
                    self.sponsorFecId(fecId);
                    return self.sponsorFecId;
                }
            }
            catch(e){return null;}
        };
        self.matchSponsorCommitteeToFecId = function() {
            try {
                var fecId = typeaheads.committees[self.sponsorCommittee()];
                if (fecId !== null) {
                    self.sponsorCommitteeFecId(fecId);
                    return self.sponsorCommitteeFecId;
                }
            }
            catch(e){return null;}
        };
        self.matchSubjectToFecId = function() {
            try {
                var fecId = typeaheads.candidates[self.subjectName()];
                if (fecId !== null) {
                    self.subjectFecId(fecId);
                    return self.subjectFecId;
                }
            }
            catch(e){return null;}
        };
    }

    var appFormView = new FormViewModel();

    ko.applyBindings(appFormView);

    function attach_typeaheads () {
        $('input[name=stationCallsign]').typeahead({
            source: typeaheads.callsigns
        });
        $('input[name=sponsorCommittee],input[name=sponsoredBy]').typeahead({
            minLength: 2,
            source: function(query, callback) {
                callback(committee_names);
            }
        });
        var candidateTypeaheadConfig = {
            minLength: 2,
            source: function(query, callback) {
                callback(candidate_names);
            }
        };
        $('input[name=subjectName]').typeahead(candidateTypeaheadConfig);
        $('input[name=sponsorCandidate]').typeahead(candidateTypeaheadConfig);
        $('input[name=officeSought]').typeahead({
            source: ["U.S. Senate", "U.S. House of Representatives", "President of the United States", "Governor of "]
        });
    }

    function processPlaceholders () {
        /*
            Enable placeholders on browsers without native support
        */
        if (!Modernizr.input.placeholder) {
            var formpl = '#fcc_form [placeholder]';
            $(formpl).each(function(event) {
                if ($(this).val() === '') // if field is empty
                {
                    $(this).val( $(this).attr('placeholder') );
                }
            });
            $(document).on('focus', formpl, function(event) {
                if ($(this).val() === $(this).attr('placeholder'))
                {
                    $(this).val('');
                }
            });
            $(document).on('blur', formpl, function(event) {
                if ($(this).val() === '' || $(this).val() === $(this).attr('placeholder'))
                {
                    $(this).val($(this).attr('placeholder'));
                }
            });
            $(document).on('submit', 'form', function(event) {
                $(this).find('[placeholder]').each(function()
                {
                    if ($(this).val() === $(this).attr('placeholder'))
                    {
                        $(this).val('');
                    }
                });
            });

        }
    }

    committee_names = _.keys(typeaheads.committees);
    candidate_names = _.keys(typeaheads.candidates);

    $(document).ready(function($) {
        attach_typeaheads();
        processPlaceholders();
    });
});

