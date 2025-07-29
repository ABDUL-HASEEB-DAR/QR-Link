import { User, QrData } from "../models/mergeModels.js";

const createQrData = async (req, res) => {
  const { userId, qrCodeUserLink, qrCodeImage, isLogged } = req.body;
  if (!userId || !qrCodeUserLink || !qrCodeImage) {
    res.status(400).json({
      error: "Missing required fields i.e userId, qrCodeUserLink, qrCodeImage",
    });
    return;
  }
  const qrCodeImageLink = qrCodeImage;
  let expireDate;
  const findUser = await User.findOne({ _id: userId });
  if (!findUser) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  if (isLogged === "true") {
    expireDate = new Date(Date.now() + 60 * 1000);
  } else {
    expireDate = null;
  }
  const newQrData = new QrData({
    userId,
    qrCodeUserLink,
    qrCodeImageLink: qrCodeImageLink,
    expiryDate: expireDate,
  });
  QrData.create(newQrData);
  res.status(200).json({
    message: "QR code data saved successfully",
    qrCodeData: newQrData,
  });
  try {
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getQrData = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(400).json({ error: "User ID is required i.e userId" });
    return;
  }
  const findUser = await User.findOne({ _id: userId });
  if (!findUser) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const qrData = await QrData.find({ userId });
  res.status(200).json({ qrData });
};

const deleteQrData = async (req, res) => {
  const { qrId } = req.body;
  const findQrData = await QrData.findOne({ _id: qrId });
  console.log("this is find", findQrData);
  if (!findQrData) {
    res.status(404).json({ error: "Qr Data not found" });
    return;
  }
  const qrData = await QrData.deleteMany({ _id: qrId });
  res
    .status(200)
    .json({ message: "QR code data deleted successfully", status: true });
};

export { createQrData, getQrData, deleteQrData };
