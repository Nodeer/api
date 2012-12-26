/**
 * Error codes used by Apple
 * @see <a href="https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/CommunicatingWIthAPS/CommunicatingWIthAPS.html#//apple_ref/doc/uid/TP40008194-CH101-SW4">The Binary Interface and Notification Formats</a>
 */

exports.Errors = {
	'noErrorsEncountered': 0,
	'processingError': 1,
	'missingDeviceToken': 2,
	'missingTopic': 3,
	'missingPayload': 4,
	'invalidTokenSize': 5,
	'invalidTopicSize': 6,
	'invalidPayloadSize': 7,
	'invalidToken': 8,
	'none': 255
};

exports.status = {
	'offline': "0",
	'online': "1",
	'requesting': "2",
	'accepted': "3",
	'arrival': "4",
	'pickedUp': "5",
};

exports.taxiChargeRate = {
	'default': 1000,
	'online': "1",
	'requesting': "2",
	'accepted': "3",
	'arrival': "4",
	'pickedUp': "5",
};

exports.taxiSpeed = {
	'default': 1000,
	'online': "1",
	'requesting': "2",
	'accepted': "3",
	'arrival': "4",
	'pickedUp': "5",
};