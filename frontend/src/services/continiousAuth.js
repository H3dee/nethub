import axios from 'axios';

import { filterDuplicatesByField } from '../util/filterDuplicates';

const instance = axios.create({
  baseURL: 'https://e9a9-37-139-35-16.eu.ngrok.io/api/continious-auth',
});

const mode = process.env.REACT_APP_CONTINUOUS_AUTH_MODE;

class ContiniousAuth {
  sendRawDataChunk(chunk) {
    const cleanedChunk = filterDuplicatesByField(chunk, 'timestamp');

    const body = { chunks: cleanedChunk, mode };
    const serializedBody = JSON.stringify(body);

    const headers = { headers: { 'content-type': 'application/json' } };

    return instance.post('/chunk', serializedBody, headers);
  }

  completeDataCollecting(userId) {
    const body = { userId };
    const serializedBody = JSON.stringify(body);

    const headers = { headers: { 'content-type': 'application/json' } };

    return instance.post('/complete', serializedBody, headers);
  }
}

export default new ContiniousAuth();
