import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api/continious-auth',
});

class ContiniousAuth {
  sendRawDataChunk(chunk) {
    const serializedChunk = chunk.map((record) => JSON.stringify(record));
    const filteredChunk = [...new Set(serializedChunk)];
    const deserializedChunk = filteredChunk.map((serialisedRecord) => JSON.parse(serialisedRecord));

    const body = { chunks: deserializedChunk };
    const serializedBody = JSON.stringify(body);

    const headers = { headers: { 'content-type': 'application/json' } };

    return instance.post('/chunk', serializedBody, headers);
  }
}

export default new ContiniousAuth();
