export default function serverRequest(url, method, data, callback) {
  const METHOD_VALUES = ['FILE', 'GET', 'POST'];
  const STATUS_OK = 200;

  if (!url || typeof url != 'string' || !url.trim().length)
    return callback('bad_request');

  if (!method || !METHOD_VALUES.includes(method))
    return callback('bad_request');

  if (!data || typeof data != 'object')
    return callback('bad_request');

  const req = new XMLHttpRequest();

  req.addEventListener('readystatechange', function () {
    if (req.readyState == XMLHttpRequest.DONE) {
      if (req.status != STATUS_OK)
        return callback('network_error');

      if (req.responseText) {
        try {
          const response = JSON.parse(req.responseText);

          if (response.err)
            return callback(response.err);

          return callback(null, response.data);
        } catch (err) {
          console.log(err);
          return callback('network_error');
        };
      };
    };
  });

  if (method == 'FILE') {
    req.open('POST', url);

    const formdata = new FormData();
    Object.keys(data).forEach(key => {
      formdata.append(key, data[key]);
    });

    req.send(formdata);
  } else if (method == 'GET') {
    req.open('GET', url);
    req.send();
  } else if (method == 'POST') {
    req.open('POST', url);
    req.setRequestHeader('Content-type', 'application/json');
    req.send(JSON.stringify(data));
  };
};
