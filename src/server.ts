import * as grpc from '@grpc/grpc-js';
import { GreeterService, IGreeterService, IGreeterService_ISayHello } from '../generate/greeter_grpc_pb';
import { HelloRequest, HelloReply } from '../generate/greeter_pb';

class GreeterServer implements IGreeterService {
  [name: string]: grpc.UntypedHandleCall;

  sayHello: IGreeterService_ISayHello = (
    call: grpc.ServerUnaryCall<HelloRequest, HelloReply>,
    callback: grpc.sendUnaryData<HelloReply>
  ): void => {
    const reply = new HelloReply()
    reply.setMessage(`Hello, ${call.request.getName()}!`)
    // 第1引数はエラーオブジェクト、ここではエラーがないのでnullを指定
    // 第2引数はレスポンスオブジェクト
    callback(null, reply);
  }

  // /Users/tomoki/projects/sandbox/grpc-ts/node_modules/ts-node/src/index.ts:859
  //     return new TSError(diagnosticText, diagnosticCodes, diagnostics);
  //            ^
  // TSError: ⨯ Unable to compile TypeScript:
  // src/server.ts:8:3 - error TS2416: Property 'sayHello' in type 'GreeterServer' is not assignable to the same property in base type 'IGreeterService'.
  //   Type '(call: ServerUnaryCall<HelloRequest, HelloReply>, callback: sendUnaryData<HelloReply>) => void' is not assignable to type 'IGreeterService_ISayHello'.

  // 8   sayHello(
  //     ~~~~~~~~

  // sayHello(
  //   call: grpc.ServerUnaryCall<HelloRequest, HelloReply>,
  //   callback: grpc.sendUnaryData<HelloReply>
  // ): void {
  //   const reply = new HelloReply();
  //   reply.setMessage(`Hello, ${call.request.getName()}!`);
  //   // 第1引数はエラーオブジェクト、ここではエラーがないのでnullを指定
  //   // 第2引数はレスポンスオブジェクト
  //   callback(null, reply);
  // }
  // 
}

function main() {
  const server = new grpc.Server();
  server.addService(GreeterService, new GreeterServer());
  const port = '50051';
  server.bindAsync(
    `localhost:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error(`Failed to bind server: ${error.message}`);
        return;
      }
      console.log(`Server running at http://localhost:${port}`);
      server.start();
    }
  );
}

main();