import Session from "../model/session.model.js";

export const deviceFingerprintMiddleware = async (req, res, next) => {
  try {
    const deviceFingerprint = req.body.deviceFingerprint || req.header("X-Device-Fingerprint");

    if (deviceFingerprint) {
      req.deviceFingerprint = deviceFingerprint;
    }

    next();
  } catch (error) {
    console.error("Device fingerprint middleware error:", error);
    next();
  }
};

export const checkTrustedDevice = async (req, res, next) => {
  try {
    const { deviceFingerprint, userId } = req.body;

    if (!deviceFingerprint || !userId) {
      return next();
    }

    const trustedSession = await Session.findOne({
      userId,
      deviceFingerprint,
      isTrustedDevice: true,
      deviceTrustExpiry: { $gt: new Date() },
      is2FaComplete: true,
    });

    if (trustedSession) {
      req.trustedDevice = true;
      req.skipTwoFA = true;
    }

    next();
  } catch (error) {
    console.error("Check trusted device error:", error);
    next();
  }
};
