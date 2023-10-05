
import http from "./http";

// 진짜 호출이 되는지 확인겸 샘플로 하나 만들자
const TestInfo = async () => {
    const response = await http.post('http://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=5dc753fbb35d7e99e7fd80b06a9a18a7');
    return response.data;
}

const searchMainDashBoardInfo = async (apiNames, gteTime, lteTime) => {
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
    searchMainDashBoardInfo,
    TestInfo
}
