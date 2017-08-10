'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function () {
    function User() {
        _classCallCheck(this, User);

        this._id = undefined;
        this.Firstname = undefined;
        this.Lastname = undefined;
        this.email = undefined;
        this.mobile = 0;
        this.username = undefined;
        this.carmark = undefined;
        this.carsecurity = undefined;
        this.carmodelname = undefined;
        this.day = undefined;
        this.month = undefined;
        this.year = undefined;
        this.timeregister = Date.now();

        console.log('User is Inititialized..');
    }

    _createClass(User, [{
        key: 'reset',
        value: function reset(usertype) {

            var UserToJson = {

                _id: this._id = usertype._id,
                email: this.email = usertype.email ? usertype.email : undefined,
                Firstname: this.Firstname = usertype.Firstname,
                Lastname: this.Lastname = usertype.Lastname,
                mobile: this.mobile = usertype.mobile ? usertype.mobile : undefined,
                username: this.username = usertype.mobile ? usertype.mobile : usertype.email,
                carmark: this.carmark = usertype.carmark,
                carsecurity: this.carsecurity = usertype.carsecurity,
                carnumber: this.carnumber = usertype.carnumber,
                carmodelname: this.carmodelname = usertype.carmodelname,
                day: this.day = usertype.day.title,
                month: this.month = usertype.month.title,
                year: this.year = usertype.year.title,
                timeregister: this.timeregister = usertype.timeregister
            };

            return UserToJson;
        }
    }]);

    return User;
}();

module.exports = new User();