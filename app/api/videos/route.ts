import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = 'https://strapi.xiaoxinlook.cc/api/videos';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    try {
        // 获取当前 count 值
        const getResponse = await fetch(`${STRAPI_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!getResponse.ok) {
            throw new Error('Failed to fetch video data');
        }

        const videoData = await getResponse.json();
        const currentCount = videoData.data.attributes.count || 0;

        // 更新 count 值
        const newCount = currentCount + 1;
        const putResponse = await fetch(`${STRAPI_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    count: newCount
                }
            })
        });

        if (!putResponse.ok) {
            throw new Error('Failed to update video count');
        }

        const updatedData = await putResponse.json();

        return NextResponse.json({
            message: 'Count updated successfully',
            newCount: updatedData.data.attributes.count
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}