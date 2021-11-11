const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require('path');
const helper = require('@src/helpers/wrapper');
const exportModel = require('@modules/export/exportModel');
require('dotenv').config();

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    maximumSignificantDigits: 4,
    currency: 'IDR',
    style: 'currency',
  }).format(number);
};

module.exports = {
  exportTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      const { URL_BACKEND } = process.env;
      let result = await exportModel.getTransactionById(id);
      if (result.length < 1) {
        return helper.response(res, 404, 'Data transaction not found', null);
      }
      result = result[0];
      result = {
        ...result,
        fullName: `${result.firstName} ${result.lastName}`,
        balance: formatRupiah(result.balance),
        amount: formatRupiah(result.amount),
        noTelp: `+62${result.noTelp}`,
        image: result.image
          ? `${URL_BACKEND}/uploads/${result.image}`
          : 'https://joeschmoe.io/api/v1/random',
      };

      const fileName = `transaction-${id}.pdf`;
      ejs.renderFile(
        path.join(__dirname, '../../templates/pdf', 'report-transfer-template.ejs'),
        { result: result },
        (err, data) => {
          if (err) {
            return helper.response(res, 400, 'Failed Export Transaction', err);
          } else {
            const options = {
              height: '11.25in',
              width: '8.5in',
              header: {
                height: '20mm',
              },
              footer: {
                height: '20mm',
              },
            };
            pdf
              .create(data, options)
              .toFile(
                path.join(__dirname, '../../../public/generate/', fileName),
                function (err, data) {
                  if (err) {
                    return helper.response(res, 400, 'Failed Export Transaction', err);
                  } else {
                    return helper.response(res, 200, 'Success Export File Transaction', {
                      url: `${URL_BACKEND}/generate/${fileName}`,
                    });
                  }
                }
              );
          }
        }
      );
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
