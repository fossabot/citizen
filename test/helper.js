const nock = require('nock');

module.exports = {
  enableMock: ({ modulePath }) => {
    if (process.env.MOCK) {
      nock('https://s3.amazonaws.com/')
        .persist()
        .get(`/${process.env.AWS_S3_BUCKET}/${modulePath}`)
        .reply(
          301,
          '<?xml version="1.0" encoding="UTF-8"?>\n<Error><Code>PermanentRedirect</Code><Message>The bucket you are attempting to access must be addressed using the specified endpoint. Please send all future requests to this endpoint.</Message><Bucket>kr.ne.outsider.test</Bucket><Endpoint>kr.ne.outsider.test.s3.amazonaws.com</Endpoint><RequestId>58EF4C831A73A670</RequestId><HostId>Mq33AX51tRFJ0O/ezFcKccsl7S3m02c0uhqkC7uRerJb5Cv0efGHODCC8cwQ0C0nl3CEc7V7XtA=</HostId></Error>',
          ['x-amz-bucket-region', 'ap-northeast-1',
            'x-amz-request-id', '58EF4C831A73A670',
            'x-amz-id-2', 'Mq33AX51tRFJ0O/ezFcKccsl7S3m02c0uhqkC7uRerJb5Cv0efGHODCC8cwQ0C0nl3CEc7V7XtA=',
            'Content-Type', 'application/xml',
            'Transfer-Encoding', 'chunked',
            'Date', 'Sun, 21 Jan 2018 18:26:55 GMT',
            'Server', 'AmazonS3'],
        )
        .put(`/${process.env.AWS_S3_BUCKET}/${modulePath}`)
        .reply(
          301,
          '<?xml version="1.0" encoding="UTF-8"?>\n<Error><Code>PermanentRedirect</Code><Message>The bucket you are attempting to access must be addressed using the specified endpoint. Please send all future requests to this endpoint.</Message><Bucket>kr.ne.outsider.test</Bucket><Endpoint>kr.ne.outsider.test.s3.amazonaws.com</Endpoint><RequestId>4866C0935AE2BFFF</RequestId><HostId>K+O3Tu4fOutZxBCZ6f41Da+STD1zq1xVxmsjLjSjuCIRPKH/VcgXtPeR5ypde9z+LofIhkxajXE=</HostId></Error>',
          ['x-amz-bucket-region', 'ap-northeast-1',
            'x-amz-request-id', '4866C0935AE2BFFF',
            'x-amz-id-2', 'K+O3Tu4fOutZxBCZ6f41Da+STD1zq1xVxmsjLjSjuCIRPKH/VcgXtPeR5ypde9z+LofIhkxajXE=',
            'Content-Type', 'application/xml',
            'Transfer-Encoding', 'chunked',
            'Date', 'Sun, 21 Jan 2018 12:50:16 GMT',
            'Connection', 'close',
            'Server', 'AmazonS3'],
        );

      nock('https://s3.ap-northeast-1.amazonaws.com')
        .persist()
        .put(`/${process.env.AWS_S3_BUCKET}/${modulePath}`)
        .reply(
          200,
          '',
          ['x-amz-id-2', 'svpKcyIH+XuAnlZIypbIbRnp6XNd6swNlKuFEV3soIRd2Imr+1nmnp2L4gcEbqP+eKU3MHUugdE=',
            'x-amz-request-id', '6E659346AF7425E4',
            'Date', 'Sun, 21 Jan 2018 12:50:17 GMT',
            'ETag', '"ed168b6114db5f54d38bb1bd9ba45106"',
            'Content-Length', '0',
            'Server', 'AmazonS3'],
        )
        .get(`/${process.env.AWS_S3_BUCKET}/${modulePath}`)
        .reply((uri) => {
          if (uri.indexOf('module.tar.gz') !== -1 || uri.indexOf('complex.tar.gz') !== -1) { // when publishing module
            return [404, '<?xml version="1.0" encoding="UTF-8"?>\n<Error><Code>NoSuchKey</Code><Message>The specified key does not exist.</Message><Key>citizen/1516553253143/test.tar.gz/wrong</Key><RequestId>CA3688C9219019B8</RequestId><HostId>HoNack5lolKkIbPaGJADKOA1jLDxlP/G1gJMdi9Xc3j5WSaeHJphz/uqVLqDrMjA24W/8+kvJXM=</HostId></Error>',
              ['x-amz-request-id', 'CA3688C9219019B8',
                'x-amz-id-2', 'HoNack5lolKkIbPaGJADKOA1jLDxlP/G1gJMdi9Xc3j5WSaeHJphz/uqVLqDrMjA24W/8+kvJXM=',
                'Content-Type', 'application/xml',
                'Transfer-Encoding', 'chunked',
                'Date', 'Sun, 21 Jan 2018 16:47:34 GMT',
                'Server', 'AmazonS3'],
            ];
          }

          return [200, '',
            ['x-amz-id-2', 'UTXd/Ac9Lpf5htlqmY7jIa//st0VNw3HiV0H2tFpjQrabzdF0a1A0RXwaXXEDJsSMC0z9ieqSJg=',
              'x-amz-request-id', '51DCE049BC4189E5',
              'Date', 'Sun, 21 Jan 2018 16:47:35 GMT',
              'Last-Modified', 'Sun, 21 Jan 2018 16:47:35 GMT',
              'ETag', '"ed168b6114db5f54d38bb1bd9ba45106"',
              'Accept-Ranges', 'bytes',
              'Content-Type', 'application/octet-stream',
              'Content-Length', '136',
              'Server', 'AmazonS3'],
          ];
        })
        .get(`/${process.env.AWS_S3_BUCKET}/${modulePath}/wrong`)
        .reply(
          404,
          '<?xml version="1.0" encoding="UTF-8"?>\n<Error><Code>NoSuchKey</Code><Message>The specified key does not exist.</Message><Key>citizen/1516553253143/test.tar.gz/wrong</Key><RequestId>CA3688C9219019B8</RequestId><HostId>HoNack5lolKkIbPaGJADKOA1jLDxlP/G1gJMdi9Xc3j5WSaeHJphz/uqVLqDrMjA24W/8+kvJXM=</HostId></Error>',
          ['x-amz-request-id', 'CA3688C9219019B8',
            'x-amz-id-2', 'HoNack5lolKkIbPaGJADKOA1jLDxlP/G1gJMdi9Xc3j5WSaeHJphz/uqVLqDrMjA24W/8+kvJXM=',
            'Content-Type', 'application/xml',
            'Transfer-Encoding', 'chunked',
            'Date', 'Sun, 21 Jan 2018 16:47:34 GMT',
            'Server', 'AmazonS3'],
        )
        .delete(`/${process.env.AWS_S3_BUCKET}/${modulePath}`)
        .reply(
          204,
          '',
          ['x-amz-id-2', 'S0/qBL0imAEhHXwySaB9UxDzA025VeonKZa7A4lP5LZgDC6jiYRhmb5gpRhbbOO6e+SkfvVSLh0=',
            'x-amz-request-id', 'B9DB7B4B906399D7',
            'Date', 'Sun, 21 Jan 2018 12:50:18 GMT',
            'Server', 'AmazonS3'],
        );
    }
  },
  clearMock: () => {
    if (process.env.MOCK) {
      nock.cleanAll();
    }
  },
  deleteDbAll: async (db) => {
    const result = await db.allDocs();
    await Promise.all(result.rows.map(row => db.remove(row.id, row.value.rev)));
  },
};
