
import http from "./http";

const searchChannelDashboardInfo = async (apiNames, gteTime, lteTime) => {
    try {
        const response = await http.post('/logs-event-channel/_search', {
            size: 0,
            query: {
                bool: {
                    filter: [
                        {
                            range: {
                                "@timestamp": {
                                    "gte": gteTime,
                                    "lte": lteTime
                                }
                            }
                        },
                        {
                            terms: {
                                "hc.api.name": apiNames
                            }
                        }
                    ]
                }
            },
            aggs: {
                api_name: {
                    terms: {
                        field: "hc.api.name",
                        size: 10
                    }
                }
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        throw error;
    }
}

export {
    searchChannelDashboardInfo
}
