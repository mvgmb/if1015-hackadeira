const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const StartGrpcServer = grpcSubject => {
  const SERVER_ADDRESS = 'localhost:5001';

  const proto = grpc.loadPackageDefinition(
    protoLoader.loadSync('voltage.proto', {})
  );

  const server = new grpc.Server();
  server.addService(proto.voltagePackage.Voltage.service, {
    write: (call, callback) => {
      grpcSubject.next(call.request.voltage);

      const response = {
        status: {
          code: 200,
          message: 'OK',
        },
      };

      callback(null, response);
    },
  });

  server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());
  server.start();
};

module.exports = StartGrpcServer;
