import http from "./http";

const searchEventLogInfo = async (serviceName, gteDttm, lteDttm, guid, ipAddress, csno) => {
    try {
        const response = await http.post('/logs-transaction-channel/_search', {
            size: 10000,
            _source: false,
            fields: [
                "@timestamp",
                "hc.guid.fst",
                "hc.guid.now",
                "hc.transaction.common.TRM_IPAD",
                "hc.csno",
                "event.category",
                "message"
            ],
            sort: [
                {
                    "@timestamp": {
                        "order": "asc"
                    }
                }
            ],
            query: {
                bool: {
                    filter: [
                        {
                            range: {
                                "@timestamp": {
                                    "gte": gteDttm,
                                    "lte": lteDttm
                                }
                            }
                        },
                        {
                            terms: {
                                "hc.service.name": [serviceName]
                            }
                        },
                        {
                            terms: {
                                "hc.guid.now": [guid]
                            }
                        },
                        {
                            terms: {
                                "hc.transaction.common.TRM_IPAD": [ipAddress]
                            }
                        },
                        {
                            terms: {
                                "hc.csno": [csno]
                            }
                        }
                    ]
                }
            }
        });
        
        return response.data;
    } catch (error) {
        // 타임아웃 에러 처리
        if (error.code === 'ECONNABORTED') {
            console.error('API 타임아웃');
            throw new Error('API 타임아웃');
        } else {
            console.error('API 요청 중 오류 발생:', error);
            throw error;
        }
    }
}

function postEventLog(url, data) {
    return axios.post('https://reqres.in/api/users?page=1', data);
}

function getEventLog(url) {
    return axios.get('https://reqres.in/api/users?page=1');
}

export {
    searchEventLogInfo , postEventLog, getEventLog
}
