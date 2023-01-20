import React from 'react'
import styled from 'styled-components'

const ItemList = ({ name, data, symble, ...rest }) => {
	return (
		<Continer>
			<div className='item' {...rest}>
				<div className='elem'>{name}</div>
				<div className='value'>
					{data} 
					{symble && data > 0 ? <small>{symble}</small> : ''}
				</div>
			</div>
		</Continer>
	)
}

export default ItemList

const Continer = styled.div`
	width: 30%;
	background-color: #2a2a2a;
	border-radius: 5px;
	height: 100px;

	.item{
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.elem{
			font-size: 1rem;
		}

		.value{
			font-size: 2.5rem;
			font-weight: 600;
			letter-spacing: 0.1rem;
			color: orange;
		}

		small{
			color: orange;
		}
	}
`