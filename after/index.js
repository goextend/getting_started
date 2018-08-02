const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();

helpers = {
    ifEquals:function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    }
};
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers:helpers
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

require('./routes/index')(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
		//don't log a 404 (stops ugly error when favicon is requested
        if(err.status !== 404) console.error(err);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
