const _helpers = (() => {
  const helper = {};

  helper.formatDuration = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  helper.formatDate = (dateString) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const parts = dateString.split("-");
    const day = parseInt(parts[2]);
    const monthIndex = parseInt(parts[1]) - 1;
    const year = parseInt(parts[0]);

    const formattedDate = `${day} of ${months[monthIndex]}, ${year}`;
    return formattedDate;
  };

  helper.handleErrors = (error) => {
    console.error("An error occurred:", error);
  };

  return helper;
})();
