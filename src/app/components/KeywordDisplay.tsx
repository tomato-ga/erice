import React from 'react'
import { AllCategories, Category } from './Top100/keywords'

const KeywordDisplay: React.FC = () => {
    return (
        <div className='keyword-display'>
            {AllCategories.map((category: Category) => (
                <div key={category.MainCategoryName} className='category'>
                    <h3>{category.MainCategoryName}</h3>
                    <ul>
                        {category.Subcategories.map(sub => (
                            <li key={sub.SubCategoryName}>
                                <strong>{sub.SubCategoryName}</strong>
                                <ul>
                                    {sub.Keywords.map(keyword => (
                                        <li key={keyword}>{keyword}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}

export default KeywordDisplay