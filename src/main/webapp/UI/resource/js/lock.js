;(function (window, $, undefined) {

    var _global = {
        lockUrl: '../../sockAlert.do',
        delLockUrl: '../../delAlertsock.do',
        queryLockUrl: '../../sockAlert.do',
        sockAlertListUrl:'../../sockAlertList.do',
        delAlertsockListUrl:'../../delAlertsockList.do'
    };

    $.extend({
        lock: function (accountNum, usersysID, lock_callback, json) {
            function sock_callback(data) {
                var result = false;
                if (data.result.code == "0" && data.result.message == "sock suc") {
                    result = true;
                }
                if (data.result.code == "0" && data.result.message == "sock err") {
                    result = false;

                }
                lock_callback(result, json);
            }

            post_async(
                {
                    sysuserID: usersysID,
                    accountNum: accountNum,
                    needSock: "y",
                },
                _global.lockUrl,
                sock_callback);

        },
        delLock: function (eventNum, usersysID, delLock_callback, json) {
            function unlockCallback(data) {
                var result = false;
                if (data.result.code == "0") {
                    result = true;
                }
                if (data.result.code == "1") {
                    result = false;
                }

                delLock_callback(result, json);
            }

            post_async(
                {
                    "sysuserID": usersysID,
                    "accountNum": json.accountNum,
                    "type": 3
                },
                _global.delLockUrl,
                unlockCallback);
        },
        delAllLock: function (usersysID, delLock_callback, json) {
            function unlockCallback(data) {
                var result = false;
                if (data.result.code == "0") {
                    result = true;
                }
                if (data.result.code == "1") {
                    result = false;
                }

                delLock_callback(result, json);
            }

            post_async(
                {
                    "sysuserID": usersysID,
                    "accountNum": "",
                    "type": 2
                },
                _global.delLockUrl,
                unlockCallback);
        },
        queryLock: function (accountNum, usersysID, queryLock_callback, json) {
            function sock_callback(data) {
                var result = {};
                if (data.result.code == "1") {
                    result = {
                        code: '0',
                        lockPojo: {
                            eventNum: data.result.message[0].eventNum,
                            sysuserID: data.result.message[0].sysuserID
                        }

                    };
                }
                if (data.result.code != "1") {
                    result = {
                        code: '1'
                    };

                }
                queryLock_callback(result, json);
            }

            post_async(
                {
                    sysuserID: usersysID,
                    accountNum: accountNum,
                    needSock: "n",
                },
                _global.lockUrl,
                sock_callback);
        },
        lockList: function (eventNumList, usersysID, lock_callback, json) {
            var result = false;
            function lockCallback(data) {

                if (data.result.code == "0") {
                    result = true;
                    lock_callback(result, json);
                }else if (data.result.code == "1") {
                    result = false;
                    lock_callback(result, json);
                }else{}


            }
            post_async(
                {
                    "sysuserID": usersysID,
                    "eventNumList": eventNumList,

                },
                _global.sockAlertListUrl,
                lockCallback);


        },
        delLockList: function (eventNumList, usersysID, delLock_callback, json) {

            var result = false;
            function unlockCallback(data) {

                if (data.result.code == "0") {
                    result = true;
                    delLock_callback(result, json);
                }else if (data.result.code == "1") {
                    result = false;
                    delLock_callback(result, json);
                }else{}


            }
            post_async(
                {
                    "sysuserID": usersysID,
                    "eventNumList": eventNumList,

                },
                _global.delAlertsockListUrl,
                unlockCallback);


        }
    });


})(window, jQuery);