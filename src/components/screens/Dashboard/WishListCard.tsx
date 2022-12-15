import { WishList } from '@prisma/client';
import React from 'react';

export const WishListCard = ({ wishList }: { wishList: WishList }) => {
	return (
		<div>
			<div>
				<p>
					{wishList.id} {wishList.name}
				</p>
			</div>
			
		</div>
	);
};
