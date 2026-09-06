const translations = {
  en: {
    unauthorized: "Not authorized. Please login first.",
    invalidToken: "Invalid or expired token.",
    bookingCreated: "Booking created successfully",
    emergencyBookingCreated: "Emergency booking created successfully",
    bookingAccepted: "Booking accepted successfully",
    bookingRejected: "Booking rejected successfully",
    bookingCancelled: "Booking cancelled successfully",
    invoiceCreated: "Invoice generated successfully",
    cooperativeCreated: "Cooperative created successfully",
    workerAssigned: "Worker assigned to cooperative successfully",
    workerRemoved: "Worker removed from cooperative successfully",
  },

  hi: {
    unauthorized: "अधिकृत नहीं हैं। कृपया पहले लॉगिन करें।",
    invalidToken: "अमान्य या समाप्त टोकन।",
    bookingCreated: "बुकिंग सफलतापूर्वक बनाई गई",
    emergencyBookingCreated:
      "आपातकालीन बुकिंग सफलतापूर्वक बनाई गई",
    bookingAccepted: "बुकिंग सफलतापूर्वक स्वीकार की गई",
    bookingRejected: "बुकिंग अस्वीकार कर दी गई",
    bookingCancelled: "बुकिंग सफलतापूर्वक रद्द की गई",
    invoiceCreated: "इनवॉइस सफलतापूर्वक बनाया गया",
    cooperativeCreated:
      "सहकारी संस्था सफलतापूर्वक बनाई गई",
    workerAssigned:
      "वर्कर को सहकारी संस्था में सफलतापूर्वक जोड़ा गया",
    workerRemoved:
      "वर्कर को सहकारी संस्था से सफलतापूर्वक हटाया गया",
  },
};

const getLanguage = (user) => {
  if (user && user.language === "hi") {
    return "hi";
  }

  return "en";
};

const translate = (key, user) => {
  const language = getLanguage(user);

  return (
    translations[language]?.[key] ||
    translations.en[key] ||
    key
  );
};

module.exports = {
  translations,
  getLanguage,
  translate,
};