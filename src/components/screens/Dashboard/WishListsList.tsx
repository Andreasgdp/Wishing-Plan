import { WishList } from '@prisma/client';
import React from 'react';
import { WishListCard } from './WishListCard';

export const WishListsList = ({ wishLists }: { wishLists: WishList[] }) => {
	return (
		<div className="flex flex-col gap-4">
			<ul className="grid grid-cols-3 gap-4">
				{wishLists.map((wishList) => (
					<WishListCard key={wishList.id} wishList={wishList} />
				))}
			</ul>
		</div>
	);
};
