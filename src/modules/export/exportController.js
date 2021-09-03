const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const helper = require("@src/helpers/wrapper");
const exportModel = require("@modules/export/exportModel");

module.exports = {
  exportTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      const fileName = `${id}.pdf`;
      const result = {
        senderName: "Bagus",
        receiverName: "Timo",
        students: [
          {
            name: "Joy",
            email: "joy@example.com",
            city: "New York",
            country: "USA",
          },
          {
            name: "John",
            email: "John@example.com",
            city: "San Francisco",
            country: "USA",
          },
          {
            name: "Clark",
            email: "Clark@example.com",
            city: "Seattle",
            country: "USA",
          },
          {
            name: "Watson",
            email: "Watson@example.com",
            city: "Boston",
            country: "USA",
          },
          {
            name: "Tony",
            email: "Tony@example.com",
            city: "Los Angels",
            country: "USA",
          },
        ],
      };
      ejs.renderFile(
        path.join(
          __dirname,
          "../../templates/pdf",
          "report-transfer-template.ejs"
        ),
        { result: result },
        (err, data) => {
          if (err) {
            return helper.response(res, 400, "Failed Export Transaction", err);
          } else {
            const options = {
              height: "11.25in",
              width: "8.5in",
              header: {
                height: "20mm",
              },
              footer: {
                height: "20mm",
              },
            };
            pdf
              .create(data, options)
              .toFile(
                path.join(__dirname, "../../../public/generate/", fileName),
                function (err, data) {
                  if (err) {
                    return helper.response(
                      res,
                      400,
                      "Failed Export Transaction",
                      err
                    );
                  } else {
                    return helper.response(
                      res,
                      200,
                      "Success Export File Transaction",
                      {
                        url: `http://localhost:3001/generate/${fileName}`,
                      }
                    );
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
        `Bad Request${error.message ? " (" + error.message + ")" : ""}`,
        null
      );
    }
  },
};
