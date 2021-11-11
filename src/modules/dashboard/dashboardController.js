const helper = require('@src/helpers/wrapper');
const dashboardModel = require('@modules/dashboard/dashboardModel');
const userModel = require('@modules/user/userModel');
const moment = require('moment');

const listDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const sortListDataDay = (listDay, data) => {
  const result = [];
  for (const i of listDay) {
    let res = 0;
    for (const j of data) {
      if (i === j.day) {
        res += 1;
        result.push({ day: j.day, total: j.total });
      }
    }
    if (res === 0) {
      result.push({ day: i, total: 0 });
    }
  }
  return result;
};

module.exports = {
  getDataDashboard: async (req, res) => {
    try {
      const { id } = req.params;

      const checkUser = await userModel.getDataConditions({ id });
      if (checkUser.length < 1) {
        return helper.response(res, 404, 'Id user not found', null);
      }

      let totalIncomeTopup = await dashboardModel.getTotalIncomeTopup(id);
      let totalIncomeTransfer = await dashboardModel.getTotalIncomeTransfer(id);
      let totalExpenseTransfer = await dashboardModel.getTotalExpenseTransfer(id);
      totalIncomeTopup = totalIncomeTopup.length > 0 ? Number(totalIncomeTopup[0].total) : 0;
      totalIncomeTransfer =
        totalIncomeTransfer.length > 0 ? Number(totalIncomeTransfer[0].total) : 0;
      totalExpenseTransfer =
        totalExpenseTransfer.length > 0 ? Number(totalExpenseTransfer[0].total) : 0;

      const totalIncome = totalIncomeTopup + totalIncomeTransfer;
      const totalExpense = totalExpenseTransfer;

      let listIncomeTopup = await dashboardModel.getListIncomeTopup(id);
      let listIncomeTransfer = await dashboardModel.getListIncomeTransfer(id);
      let listExpenseTransfer = await dashboardModel.getListExpenseTransfer(id);

      listIncomeTopup = listIncomeTopup.map((item) => {
        return { total: Number(item.total), day: moment(item.date).format('dddd') };
      });
      listIncomeTransfer = listIncomeTransfer.map((item) => {
        return { total: Number(item.total), day: moment(item.date).format('dddd') };
      });
      listExpenseTransfer = listExpenseTransfer.map((item) => {
        return { total: Number(item.total), day: moment(item.date).format('dddd') };
      });

      listIncomeTopup = sortListDataDay(listDay, listIncomeTopup);
      listIncomeTransfer = sortListDataDay(listDay, listIncomeTransfer);
      listExpenseTransfer = sortListDataDay(listDay, listExpenseTransfer);

      listIncomeTransfer = listIncomeTransfer.map((item, index) => {
        return { ...item, total: item.total + listIncomeTopup[index].total };
      });

      const result = {
        totalIncome,
        totalExpense,
        listIncome: listIncomeTransfer,
        listExpense: listExpenseTransfer,
      };
      return helper.response(res, 200, 'Success Get Data', result);
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? ' (' + error.message + ')' : ''}`,
        null
      );
    }
  },
};
