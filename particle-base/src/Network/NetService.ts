import axios from 'axios';
import { Buffer } from 'buffer';
import { ParticleInfo } from './ParticleInfo';

/**
 * Makes a JSON RPC request to the given URL, with the given RPC method and params.
 *
 * @param {string} rpcUrl - The RPC endpoint URL to target.
 * @param {string} rpcMethod - The RPC method to request.
 * @param {Array<unknown>} [rpcParams] - The RPC method params.
 * @returns {Promise<unknown|undefined>} Returns the result of the RPC method call,
 * or throws an error in case of failure.
 */
export async function JsonRpcRequest(
    rpcUrl: string,
    pathname: string,
    rpcMethod: string,
    rpcParams: any = [],
    chainId: number
) {
    let fetchUrl = rpcUrl;
    const headers = {
        'Content-Type': 'application/json',
        Authorization: '',
    };

    if (ParticleInfo.projectId == '' || ParticleInfo.clientKey == '') {
        throw new Error('You need set project info');
    }

    // URLs containing username and password needs special processing
    const username = ParticleInfo.projectId;
    const password = ParticleInfo.clientKey;

    if (username && password) {
        const encodedAuth = Buffer.from(`${username}:${password}`).toString('base64');
        headers.Authorization = `Basic ${encodedAuth}`;

        fetchUrl = `${rpcUrl}${pathname}`;
    }

    const body = JSON.stringify({
        id: Date.now().toString(),
        jsonrpc: '2.0',
        method: rpcMethod,
        params: rpcParams,
        chainId: chainId,
    });

    console.log(`request body = ${body}`);

    const jsonRpcResponse = await axios.post(fetchUrl, body, {
        headers,
    });

    const jsonRpcResponseJson = jsonRpcResponse.data;

    if (!jsonRpcResponseJson || Array.isArray(jsonRpcResponseJson) || typeof jsonRpcResponseJson !== 'object') {
        throw new Error(`RPC endpoint ${rpcUrl} returned non-object response.`);
    }
    const { error, result } = jsonRpcResponseJson;

    console.log(`response result = ${JSON.stringify(result)}`);

    if (error) {
        throw new Error(error?.message || error);
    }
    return result;
}

export default JsonRpcRequest;
