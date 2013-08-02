require.config({ baseUrl: 'js/lib',
    paths: {
        templates:'../templates',
        data: '../data',
        jquery: 'jquery-1.10.2.min',
        sfapp: '../../sfapp'
    }
});

require(['jquery', 'text', 'handlebars', 'data/typeaheads', 'modernizr.min',
        'sfapp/js/bootstrap.min', 'sfapp/js/sfapp'],
function($, text, handlebars, typeaheads) {
    $(document).ready(function($) {
        /*
            Enable placeholders on browsers without native support
        */
        if (!Modernizr.input.placeholder) {
            $(this).find('[placeholder]').each(function()
            {
                if ($(this).val() === '') // if field is empty
                {
                    $(this).val( $(this).attr('placeholder') );
                }
            });
            $('[placeholder]').focus(function()
                {
                    if ($(this).val() == $(this).attr('placeholder'))
                    {
                        $(this).val('');
                        $(this).removeClass('placeholder');
                    }
                }).blur(function()
                {
                    if ($(this).val() === '' || $(this).val() == $(this).attr('placeholder'))
                    {
                        $(this).val($(this).attr('placeholder'));
                        $(this).addClass('placeholder');
                    }
                });

                // remove placeholders on submit
                $('[placeholder]').closest('form').submit(function()
                {
                    $(this).find('[placeholder]').each(function()
                    {
                        if ($(this).val() == $(this).attr('placeholder'))
                        {
                            $(this).val('');
                        }
                    });
                });
        }

        /*
            form#fcc_form stuff
        */

        $('#advertisement_subject').change(function(evt) {
            var subject_type = $(this).val();
            if (subject_type == 'candidate') {
                $('input[name=candidate_name]').attr('required', 'required');
                $('#form_candidate_extras').show();
            }
            else {
                $('input[name=candidate_name]').removeAttr('required');
                $('#form_candidate_extras').hide();
            }
            if (subject_type != "") {
                var placeholder_text = 'Enter ' + subject_type + ' name';
                $('input[name=candidate_name]').attr('placeholder', placeholder_text);
            };
        });

        $('#advertisement_subject').change();

        $('input[name=station_callsign]').typeahead({
            source: typeaheads.callsigns
        });

        /*
            Form submission
        */
        $('#fcc_form').submit(function(evt) {
            console.log("Form submitted");
            evt.preventDefault();
            return false;
        });
    });
});

