const getStubMethod = (listApi: any) => {
  let createStub = '';
  let createStubPost = '';
  let createStubPut = '';
  let createStubDelete = '';

  listApi?.map((ele: any, index: number) => {
    switch (ele?.method) {
      case 'get':
        createStub = createStub + '\n'
          + 'stubGet.withArgs(`' + ele.apiCallContent + '`, sinon.match.any).returns('
          + '\n'
          + `Promise.resolve({
          data: [],
          status: 200,
          statusText: "OK",
          headers: {},
          config: {},
        }).then()
      );`
        break;
      case 'post':
        createStubPost = createStubPost + '\n'
          + 'stubPost.withArgs(`' + ele.apiCallContent + '`, sinon.match.any).returns('
          + '\n'
          + `Promise.resolve({
            status: 201,
            data: {
              message: "保存しました。",
            },
          }).then()
        );`
        break;
      case 'put':
        createStubPut = createStubPut + '\n'
          + 'stubPut.withArgs(`' + ele.apiCallContent + '`, sinon.match.any).returns('
          + '\n'
          + `Promise.resolve({
            status: 204,
            data: {
              message: "保存しました。",
            },
          }).then()
        );`
        break;
      case 'delete':
        createStubDelete = createStubDelete + '\n'
          + 'stubDelete.withArgs(`' + ele.apiCallContent + '`, sinon.match.any).returns('
          + '\n'
          + `Promise.resolve({
            data: {},
            status: 204,
            statusText: "OK",
            headers: {},
            config: {},
          }).then()
        );`
        break;

      default:
        break;
    }
  })

  createStub = `
  const createGetStub = () => {
    const stubGet = sandbox.stub(ApiUtils, "get");
    ${createStub}
    return stubGet;
  };
  `;

  createStubPost = `
  const createPostStub = () => {
    const stubPost = sandbox.stub(ApiUtils, "post");
    ${createStubPost}
    return stubPost;
  };
  `;

  createStubPut = `
  const createPutStub = () => {
    const stubPut = sandbox.stub(ApiUtils, "put");
    ${createStubPut}
    return stubPut;
  };
  `;

  createStubDelete = `
  const createDeleteStub = () => {
    const stubDelete = sandbox.stub(ApiUtils, "delete");
    ${createStubDelete}
    return stubDelete;
  };
  `;

  return {
    createStub,
    createStubPost,
    createStubPut,
    createStubDelete,
  }
}

const getToastStub = (text: string) => {
  let defineToast = '';
  let resetToast = '';
  const isHaveToast = {
    isHave: false,
    info: false,
    success: false,
    error: false,
    warn: false,
    remove: false,
  }
  if (text.includes('ToastMessageUtils.info')) {
    isHaveToast.isHave = true;
    isHaveToast.info = true;
  }
  if (text.includes('ToastMessageUtils.success')) {
    isHaveToast.isHave = true;
    isHaveToast.success = true;
  }
  if (text.includes('ToastMessageUtils.error')) {
    isHaveToast.isHave = true;
    isHaveToast.error = true;
  }
  if (text.includes('ToastMessageUtils.warn')) {
    isHaveToast.isHave = true;
    isHaveToast.warn = true;
  }
  if (text.includes('ToastMessageUtils.remove')) {
    isHaveToast.isHave = true;
    isHaveToast.remove = true;
  }
  if(isHaveToast.isHave) {
    defineToast = `const messageUtilsStub: sinon.SinonStubbedInstance<typeof ToastMessageUtils> = TestUtils.getMessageToastStub();`
  }
  resetToast = `
  ${isHaveToast.info ? 'messageUtilsStub.info.resetHistory();' : ''}
  ${isHaveToast.success ? 'messageUtilsStub.success.resetHistory();' : ''}
  ${isHaveToast.error ? 'messageUtilsStub.error.resetHistory();' : ''}
  ${isHaveToast.warn ? 'messageUtilsStub.warn.resetHistory();' : ''}
  ${isHaveToast.remove ? 'messageUtilsStub.remove.resetHistory();' : ''}
  `;

  return {
    defineToast,
    resetToast
  }
}

export {
  getStubMethod,
  getToastStub
}