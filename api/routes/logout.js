module.exports = function (req, res) {
	req.logout(() => {
		req.session.user = null;
		res.json({
			success: true
		});
	});
};
